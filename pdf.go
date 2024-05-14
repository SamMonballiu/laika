// https://github.com/Mindinventory/Golang-PDF-to-Image-Converter/
package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image/jpeg"

	"github.com/karmdip-mi/go-fitz"
)

func GetPdf(filePath string) map[string]string {
	imageBase64Map := make(map[string]string)

	doc, err := fitz.New(filePath)
	if err != nil {
		panic(err)
	}

	// Extract pages as images
	for n := 0; n < doc.NumPage(); n++ {
		img, err := doc.Image(n)
		if err != nil {
			panic(err)
		}

		// Encode image as base64
		var buf []byte
		buffer := bytes.NewBuffer(buf)
		err = jpeg.Encode(buffer, img, &jpeg.Options{Quality: jpeg.DefaultQuality})
		if err != nil {
			panic(err)
		}
		imageBase64 := base64.StdEncoding.EncodeToString(buffer.Bytes())

		// Store base64 string
		imageBase64Map[fmt.Sprintf("%03d", n)] = imageBase64
	}

	return imageBase64Map
}
