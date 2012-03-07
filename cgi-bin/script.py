#!/usr/bin/python
import sys
import json
f = open('templates.html', 'r')
f = f.read()
f = f.replace('_hosting_', "http://localhost:1234")
f = json.dumps({'html': f})
sys.stdout.write("""Content-type: application/x-javascript\n\n""" + 
        "jsonP(" + f + ")"
)
