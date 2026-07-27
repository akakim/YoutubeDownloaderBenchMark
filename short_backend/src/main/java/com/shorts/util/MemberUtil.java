package com.shorts.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class MemberUtil {

	public static String DELIMITER = "_";
	private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMdd");

    public static String generate() {
        String joinDate = LocalDate.now().format(DATE_FORMAT);
        String uuid = UUID.randomUUID().toString().replace("-", "");

        return joinDate + DELIMITER + uuid;
    }
    
    public static String[] deformate(String source) {
    	return source.split(DELIMITER);
    }
}
