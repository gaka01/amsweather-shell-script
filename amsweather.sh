curl -s http://93.155.192.228 | iconv -f WINDOWS-1251 -t UTF-8 | grep -Po "(?<=Температура\s\s)(.*)(?=C)."
