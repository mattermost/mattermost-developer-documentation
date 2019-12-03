package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

type YouTubePlaylistResponse struct {
	NextPageToken string `json:"nextPageToken"`
	Items         []struct {
		Snippet struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			ResourceID  struct {
				VideoID string `json:"videoId"`
			} `json:"resourceId"`
		} `json:"snippet"`
	} `json:"items"`
}

type DevTalk struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type DevTalks struct {
	Videos []*DevTalk `json:"videos"`
}

func getJson(url string, target interface{}) error {
	var myClient = &http.Client{Timeout: 10 * time.Second}
	r, err := myClient.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	return json.NewDecoder(r.Body).Decode(target)
}

func downloadDevtalks(apiKey string) (*DevTalks, error) {
	devtalks := &DevTalks{}

	baseURL := "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL-jqvaPsjQpM-Cysf3o-6bf_P3ARQNhV4&key=" + apiKey
	pageURL := baseURL
	pageCount := 1

	for {
		log.Printf("Fetching page %d of results...\n", pageCount)
		playlistResponse := &YouTubePlaylistResponse{}
		if err := getJson(pageURL, playlistResponse); err != nil {
			return nil, err
		}

		// convert into output format
		for _, item := range playlistResponse.Items {
			devTalk := &DevTalk{
				ID:          item.Snippet.ResourceID.VideoID,
				Title:       item.Snippet.Title,
				Description: item.Snippet.Description,
			}
			devtalks.Videos = append(devtalks.Videos, devTalk)
		}

		// deal with pagination
		if playlistResponse.NextPageToken == "" {
			break
		}
		pageURL = baseURL + "&pageToken=" + playlistResponse.NextPageToken
		pageCount++
	}

	log.Printf("Found %d videos\n", len(devtalks.Videos))
	return devtalks, nil
}

func main() {
	// ensure that the youtube api key was provided
	apiKey := os.Getenv("YOUTUBE_API_KEY")
	if apiKey == "" {
		log.Fatal("Environment variable YOUTUBE_API_KEY must be set in order to fetch dev talks")
	}

	//download the dev talks
	devtalks, err := downloadDevtalks(apiKey)
	if err != nil {
		log.Fatal(err)
	}

	// dump them to a JSON file
	b, err := json.MarshalIndent(devtalks, "", "    ")
	if err != nil {
		log.Fatal(err)
	}
	os.Stdout.Write(b)
}
