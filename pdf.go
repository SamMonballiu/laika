// https://github.com/Mindinventory/Golang-PDF-to-Image-Converter/
package main

import (
	"encoding/base64"
	"fmt"

	"github.com/karmdip-mi/go-fitz"
)

func GetPdfPages(filePath string) (pageCount int, err error) {
	doc, err := fitz.New(filePath)

	if err != nil {
		return -1, err
	}

	return doc.NumPage(), nil
}

// return base64 image
func GetPdfPage(filePath string, pageNumber int) (content string, err error) {
	doc, err := fitz.New(filePath)
	if err != nil {
		return "", err
	}

	img, err := doc.ImagePNG(pageNumber, 300)
	if err != nil {
		return "", err
	}

	doc.Close()
	return base64.StdEncoding.EncodeToString(img), nil
}

func GeneratePdfThumbnails(filePath string) map[string]string {
	imageBase64Map := make(map[string]string)

	doc, err := fitz.New(filePath)
	if err != nil {
		panic(err)
	}

	// Extract pages as images
	for n := 0; n < doc.NumPage(); n++ {
		img, err := doc.ImagePNG(n, 20)
		if err != nil {
			panic(err)
		}

		imageBase64 := base64.StdEncoding.EncodeToString(img)
		imageBase64Map[fmt.Sprintf("%03d", n)] = imageBase64
	}

	doc.Close()

	return imageBase64Map
}
