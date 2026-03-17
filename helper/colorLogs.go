package helper

import (
	"fmt"

	"github.com/fatih/color"
)

func ColorOperation(colorName string, value any) string {
	valueString := fmt.Sprint(value)
	switch colorName {
	case "green":
		return color.HiGreenString(valueString)
	case "blue":
		return color.HiBlueString(valueString)
	case "magenta":
		return color.HiMagentaString(valueString)
	case "red":
		return color.HiRedString(valueString)
	case "yellow":
		return color.YellowString(valueString)
	default:
		return color.YellowString(valueString)
	}
}
