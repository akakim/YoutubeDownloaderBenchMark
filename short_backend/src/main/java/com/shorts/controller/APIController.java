package com.shorts.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class APIController {
	@GetMapping("helloAPI")
	Map<String,String> helloAPI(){
		return Map.of(
			"code", "0000",
	        "message", "HelloWorld"
		);
	}
}
