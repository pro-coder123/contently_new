from cosineSim import *
from htmlstrip import *
from extractdocx import *

import codecs
import traceback
import sys
import operator
import urllib, urllib2
import json as simplejson
import requests
# req = urllib2.Request("https://medium.com/the-resonant-web/spring-boot-2-0-starter-kit-part-1-23ddff0c7da2", headers={'User-Agent' : "Magic Browser"}) 
rt = requests.get("https://www.reddit.com/r/bleach/comments/33mkud/bleach_anime_opening_list/")
# rt.encoding = rt.apparent_encoding
rt.encoding = "utf-8"
text = rt.content
import re
sentenceEnders = re.compile('[.!?]')
sentenceList = sentenceEnders.split(text)
sentencesplits = []
# print sentenceList
for sentence in sentenceList:
    x = re.compile(r'\W+', re.UNICODE).split(sentence)
    x = [ele for ele in x if ele != '']
    sentencesplits.append(x)
# print sentencesplits
q = str(sentencesplits).translate(None, '[],\'') 
print q
print "Spring Integration Testing is" in q