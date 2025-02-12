package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	oc "github.com/haideralsh/options-lab/api-helpers"
)

type OptionChain struct {
	Percentage float64 `json:"percentage"`
	Strike     float64 `json:"strike"`
	Bid        float64 `json:"bid"`
	Expiration string  `json:"expiration"`
}

type RequestBody struct {
	Symbols           []oc.Symbol `json:"symbols"`
	Percentage        float64     `json:"percentage"`
	ExpiresWithinDays int         `json:"expires_within_days"`
}

func Chains(w http.ResponseWriter, r *http.Request) {
	parsedRequest, err := parseRequest(r)
	if err != nil {
		fmt.Fprint(w, err)
	}

	symbols := parsedRequest.Symbols
	percentage := parsedRequest.Percentage / 100.00
	expires_within_days := parsedRequest.ExpiresWithinDays

	res, err := find(symbols, percentage, expires_within_days)

	if err != nil {
		log.Print(err)
		fmt.Fprint(w, err)
	}

	w.Header().Set("Content-Type", "application/json")
	oc.SetCorsHeaders(w)

	w.Write(res)
}

func find(symbols []string, percentage float64, expires_within_days int) ([]byte, error) {
	coefficient := 1.00 + percentage

	quotes := make(map[string]<-chan float64)
	options := make(map[string][]<-chan []interface{})
	optimal := make(map[string]map[string][]interface{})
	expirations := make(map[string]<-chan []interface{})

	for _, s := range symbols {
		quotes[s] = getQuote(s)
		expirations[s] = getOptionExpirations(s)
	}

	for _, s := range symbols {
		for _, exp := range <-expirations[s] {
			options[s] = append(options[s], getOptions(s, exp.(string)))
		}
	}

	for _, s := range symbols {
		q := <-quotes[s]

		target := q * coefficient
		for _, o := range options[s] {
			optimalPerExpirationDate := findOptimalOptions(<-o, q, target, percentage, expires_within_days)

			if len(optimalPerExpirationDate) > 0 {
				_, created := optimal[s]

				if !created {
					optimal[s] = make(map[string][]interface{})
				}

				for expiration, ops := range optimalPerExpirationDate {
					optimal[s][expiration] = append(optimal[s][expiration], ops...)
				}
			}
		}
	}

	res, err := json.Marshal(optimal)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func parseRequest(r *http.Request) (RequestBody, error) {
	d := json.NewDecoder(r.Body)
	b := RequestBody{}

	err := d.Decode(&b)
	if err != nil || len(b.Symbols) < 0 || b.Percentage == 0 {
		return RequestBody{}, err
	}

	return b, nil
}

func getOptions(symbol, expiration string) <-chan []interface{} {
	r := make(chan []interface{})

	go func() {
		defer close(r)

		endpoint := fmt.Sprintf("%s/options/chains?symbol=%s&expiration=%s&greeks=true", oc.BaseUrl, symbol, expiration)
		req := oc.BuildRequest(endpoint, oc.Token)
		res := oc.GetResponse(req)

		var data map[string]interface{}
		err := json.Unmarshal(res, &data)

		if err != nil {
			log.Fatal(err)
		}

		r <- data["options"].(map[string]interface{})["option"].([]interface{})
	}()

	return r
}

func findOptimalOptions(options []interface{}, price, target, percentage float64, expires_within_days int) map[string][]interface{} {
	optimalExpirations := make(map[string][]interface{})

	for _, o := range options {
		otype := fmt.Sprintf("%v", o.(map[string]interface{})["option_type"])
		expiration := fmt.Sprintf("%v", o.(map[string]interface{})["expiration_date"])
		strike, err := strconv.ParseFloat(fmt.Sprintf("%v", o.(map[string]interface{})["strike"]), 64)
		bid, err := strconv.ParseFloat(fmt.Sprintf("%v", o.(map[string]interface{})["bid"]), 64)

		if err != nil {
			// Sometimes the strike or bid are returned as null from the API,
			// so we don't process that chain and move to the next one.
			continue
		}

		if otype == "call" && strike >= target && bid/price >= percentage && expiresWithin(expiration, expires_within_days) {
			optimalOptionChain := map[string]interface{}{
				"percentage": (bid / price) * 100,
			}

			for key, value := range o.(map[string]interface{}) {
				optimalOptionChain[key] = value
			}

			optimalExpirations[expiration] = append(optimalExpirations[expiration], optimalOptionChain)
		}
	}

	return optimalExpirations
}

func getQuote(symbol string) <-chan float64 {
	r := make(chan float64)

	go func() {
		defer close(r)

		endpoint := fmt.Sprintf("%s/quotes?symbols=%s&greeks=true", oc.BaseUrl, symbol)
		req := oc.BuildRequest(endpoint, oc.Token)
		res := oc.GetResponse(req)

		var data map[string]interface{}
		err := json.Unmarshal(res, &data)

		if err != nil {
			log.Fatal(err)
		}

		raw := data["quotes"].(map[string]interface{})["quote"].(map[string]interface{})["last"]
		str := fmt.Sprintf("%v", raw)

		quote, err := strconv.ParseFloat(str, 64)

		if err != nil {
			log.Fatal(err)
		}

		r <- quote
	}()

	return r
}

func getOptionExpirations(symbol string) <-chan []interface{} {
	r := make(chan []interface{})

	go func() {
		defer close(r)

		endpoint := fmt.Sprintf("%s//options/expirations?symbol=%s&includeAllRoots=true&strikes=false", oc.BaseUrl, symbol)
		req := oc.BuildRequest(endpoint, oc.Token)
		res := oc.GetResponse(req)

		var data map[string]interface{}
		err := json.Unmarshal(res, &data)

		if err != nil {
			log.Fatal(err)
		}

		r <- data["expirations"].(map[string]interface{})["date"].([]interface{})
	}()

	return r
}

func expiresWithin(expiration string, days int) bool {
	if days == 0 {
		return true
	}

	parsedDate, err := oc.ParseDate(expiration)
	if err != nil {
		log.Println("Unable to parse date: ", expiration, err)
		return false
	}

	return parsedDate.Before(time.Now().Add(time.Duration(days) * 24 * time.Hour))
}
