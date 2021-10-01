# -*- coding: utf-8 -*-
"""
Created on Tue Nov 10 21:57:42 2020

@author: Redlinl
"""


f = open('prompts1.txt', 'r', encoding = "UTF-8")
g = open('prompts2.txt', 'r', encoding = "UTF-8")

x = open('prompts3.txt', 'w', encoding = "UTF-8")
x.write("var soundToPrompt = {")
x.write("\n")
for i in range(576):
    x1 = f.readline()
    x1 = x1[0:len(x1)-1]
    x2 = g.readline()
    x2 = x2[0:len(x2)-1]
    x.write("\"")
    x.write(x1)
    x.write("\"")
    x.write(":")
    x.write("\"")
    x.write(x2)
    x.write("\"")
    x.write(",")
    x.write("\n")
x.write("}")
g.close()
f.close()
x.close()