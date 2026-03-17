package main

import (
	stream "changestreams"
	"fmt"
)

func main() {
	//===========> START GO ===========<
	fmt.Println("START----> CHANGE STREAMS SERVICE")

	// bod := timex.Bod(time.Now())
	// fmt.Println(bod)

	stream.StartServer()

	fmt.Println("END----> CHANGE STREAMS SERVICE")
	//===========> END GO ===========<

}
