#!/usr/bin/env bash

curl -s http://46.35.176.12/ | iconv -f WINDOWS-1251 -t UTF-8 | grep -Po "(?<=Температура\s\s)(.*)(?=C)."
