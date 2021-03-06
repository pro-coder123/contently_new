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
import re
import urllib

# Given a text string, remove all non-alphanumeric
# characters (using Unicode definition of alphanumeric).
def getQueries(text,n):
    import re
    sentenceEnders = re.compile('[.!?]')
    sentenceList = sentenceEnders.split(text)
    sentencesplits = []
    # sentences = [x.strip() for x in sentenceList if x.strip()]
    # return sentences
    for sentence in sentenceList:
        # x = re.compile(r'\W+', re.UNICODE).split(sentence)
        x = [ele for ele in sentence if ele.strip()]
        if x == []:
        	continue
        sentencesplits.append(x)

    # print sentencesplits
    return sentencesplits
    
    finalq = []
    for sentence in sentencesplits:
    	print sentence
        l = len(sentence)
        l=l/n
        index = 0
        for i in range(0,l):
            print index,index+n-1
            finalq.append(sentence[index:index+n])
            index = index + n-1
        # print 'breaks'
        # print '\n'
        if index !=len(sentence):
            finalq.append(sentence[len(sentence)-index:len(sentence)])
    return finalq

# Search the web for the plagiarised text
# Calculate the cosineSimilarity of the given query vs matched content on google
# This is returned as 2 dictionaries 
def searchWeb(text,output,c):

    try:
        # print 'text =',text
        text = text.encode('utf-8')
        # print 'text new =',text
    except:
        text =  text
    query = urllib.quote_plus(text)
    # print 'text even new =',query,len(query)
    # if len(query)>60:
    #     return output,c

    # print 'bruh'
    
    #using googleapis for searching web
    # base_url = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q='
    base_url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCVk6zEKp3M4kOdWRTvyI0tV50e8eS8Sf8&cx=004574281124797308273:zclqk7yfe8s&q="'
    url = base_url + query 
    url+='"'
    # print url
    request = urllib2.Request(url,None,{'Referer':'Google Chrome'})
    response = urllib2.urlopen(request)

    results = simplejson.load(response)
 
    try:
        if ( len(results) ):#and 'responseData' in results and 'results' in results['responseData'] and results['responseData']['results'] != []):
            for ele in    results['items']:
            	
                Match = ele
                content = Match["snippet"]
                content = content.split()
                content = " ".join([re.sub(r'\W+', '', x) for x in content])

                # print text,'\nAND\n',content
                # print '\nCOSINE :',cosineSim(text,strip_tags(content))
                # print '\n\n'


                # if Match["link"] == "https://stackshare.io/stackups/python-vs-spring-boot":
                # 	print text,'\nAND\n',content,'\nCOSINE :',cosineSim(text,strip_tags(content))
                if Match["link"] in output:
                    output[Match['link']] = output[Match['link']] + 1
                   
                    c[Match['link']] = (c[Match['link']]*(output[Match['link']] - 1) + cosineSim(text,strip_tags(content)))/(output[Match['link']])
                    
                else:
                    output[Match['link']] = 1

                    c[Match['link']] = cosineSim(text,strip_tags(content))
                    
                    
                
    except:
        return output,c
    return output,c
    

# Use the main function to scrutinize a file for
# plagiarism
def main():
    # n-grams N VALUE SET HERE
    n=9
    if len(sys.argv) <3:
        print "Usage: python main.py <input-filename>.txt <output-filename>.txt"
        sys.exit()
    if sys.argv[1].endswith(".docx"):
        t = docxExtract(sys.argv[1])
    else:
        t=open(sys.argv[1],'r')
        if not t:
            print "Invalid Filename"
            print "Usage: python main.py <input-filename>.txt <output-filename>.txt"
            sys.exit()
        t=t.read()

    queries = getQueries(t,n)
    
    q = [' '.join(d) for d in queries]
    # q = queries
    found = []
    # print q[:100]
    #using 2 dictionaries: c and output
    #output is used to store the url as key and number of occurences of that url in different searches as value
    #c is used to store url as key and sum of all the cosine similarities of all matches as value    
    output = {}
    c = {}
    i=1
    count = len(q)
    cc = 1
    for x in q:
    	print cc,x
    	cc+=1
    print 'count =',count
    if count>100:
        count=100
    for s in q[:100]:

        # print 's =',s
        output,c=searchWeb(s,output,c)

        msg = "\r"+str(i)+"/"+str(count)+"completed..."
        # sys.stdout.write(msg);
        sys.stdout.flush()
        i=i+1
    #print "\n"
    f = open(sys.argv[2],"w")
    # print c
    for ele in sorted(c.iteritems(),key=operator.itemgetter(1),reverse=True):
    	# print str(ele[0])+" "+str(ele[1]*100.00)
        f.write(str(ele[0])+" "+str(ele[1]*100.00))
        f.write("\n")
        # break
    f.close()
 
    final = {}

    print 'percentage'
    for ele in sorted(output.iteritems(),key=operator.itemgetter(1),reverse=True):
    	try:
    		rt = requests.get(ele[0])
    		text = ""

    		try:
    			text = strip_tags(rt.content)
    		except:
    			print 'bruh moment'
    			udata=rt.content.decode("utf-8")
    			asciidata=udata.encode("ascii","ignore")
    			text = strip_tags(asciidata)
    		
    		sentenceEnders = re.compile('[.!?]')
    		sentenceList = sentenceEnders.split(text)
    		sentencesplits = []
    		# print sentenceList
    		for sentence in sentenceList:
    		    x = re.compile(r'\W+', re.UNICODE).split(sentence)
    		    x = [elem for elem in x if elem != '']
    		    sentencesplits.append(x)
    		# print sentencesplits
    		q1 = str(sentencesplits).translate(None, '[],\'') 
    		q1 = text
    		cnt = 0
    		for x in q:
    			if x in q1:
    				print x
    				cnt += 1
    		final[ele[0]] = cnt*100.0/len(q)
    	except Exception as e:
    		print e
    		print 'CANT OPEN',ele[0]

    for ele in sorted(final.iteritems(),key=operator.itemgetter(1),reverse=True):
    	print ele[0],ele[1]









if __name__ == "__main__":
    try:
        main()
    except:
        #writing the error to stdout for better error detection
        error = traceback.format_exc()
        print "\nUh Oh!\n"+"Plagiarism-Checker encountered an error!:\n"+error

