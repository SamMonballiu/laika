package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetPageCount(path string) int {
	return GetPdfPages(path)
}

func (a *App) GetPdfPage(path string, pageNumber int) string {
	return GetPdfPage(path, pageNumber)
}

func (a *App) SelectFile() string { // map[string]string {
	options := runtime.OpenDialogOptions{
		Filters: []runtime.FileFilter{
			{DisplayName: "PDF files (*.pdf)", Pattern: "*.pdf"},
		},
	}
	filePath, err := runtime.OpenFileDialog(a.ctx, options)
	fmt.Println(filePath)

	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("OK")
	}

	return filePath

	// return result
	// return GetPdf(filePath)
	//GetPdf()
	//return result

	// converted, _ := ConvertPDFToJPEG(result)
	// return converted
}
