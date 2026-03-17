package main

import (
	"changestreams/controller"
	"fmt"
)

func main() {
	//===========> START GO ===========<
	fmt.Println("START----> CHANGE STREAMS SERVICE")

	// bod := timex.Bod(time.Now())
	// fmt.Println(bod)

	controller.SeedMainUsernamesMain()

	fmt.Println("END----> CHANGE STREAMS SERVICE")
	//===========> END GO ===========<

}
