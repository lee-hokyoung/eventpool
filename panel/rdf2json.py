import sys
import rdflib
from rdflib.parser import Parser
from rdflib.serializer import Serializer



rdflib.plugin.register("json-ld", Parser, "rdflib_jsonld.jsonld_parser", "JsonLDParser")
rdflib.plugin.register("json-ld", Serializer, "rdflib_jsonld.jsonld_serializer", "JsonLDSerializer")

known_vocabs = {
    "eco": "http://www.ebusiness-unibw.org/ontologies/eclass/5.1.4/#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "dbpedia": "http://dbpedia.org/resource/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dcterms": "http://purl.org/dc/terms/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "gr": "http://purl.org/goodrelations/v1#",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "vcard": "http://www.w3.org/2006/vcard/ns#",
    "vso": "http://purl.org/vso/ns#",
    "tio": "http://purl.org/tio/ns#",
    "coo": "http://purl.org/coo/ns#",
    "vvo": "http://purl.org/vvo/ns#",
    "fab": "http://purl.org/fab/ns#",
    "xro": "http://purl.org/xro/ns#",
    "xhv": "http://www.w3.org/1999/xhtml/vocab#",
    "schema": "http://schema.org/",
    "grddl": "http://www.w3.org/2003/g/data-view#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rif": "http://www.w3.org/2007/rif#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "skosxl": "http://www.w3.org/2008/05/skos-xl#",
    "wdr": "http://www.w3.org/2007/05/powder#",
    "void": "http://rdfs.org/ns/void#",
    "wdsr": "http://www.w3.org/2007/05/powder-s#",
    "xml": "http://www.w3.org/XML/1998/namespace",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "cc": "http://creativecommons.org/ns#",
    "ctag": "http://commontag.org/ns#",
    "ical": "http://www.w3.org/2002/12/cal/icaltzd#",
    "og": "http://ogp.me/ns#",
    "rev": "http://purl.org/stuff/rev#",
    "sioc": "http://rdfs.org/sioc/ns#",
    "v": "http://rdf.data-vocabulary.org/#",
    "dv": "http://data-vocabulary.org/"
}

def convert(f, do_pygmentize=False, file_format="file", source_format="rdfa", target_format="pretty-xml"):
    """Converts input data (file or content) from a given source format to a given target format."""
    global known_vocabs
    base = None
    prefixes = {}
    g = rdflib.Graph()
    
    if target_format == "rdfa" or target_format == "microdata":
        base = "http://rdf-translator.appspot.com/"
        
    if target_format == "n3" or target_format == "turtle" or target_format == "pretty-xml" or target_format == "xml":
        
        if file_format == "string":
            g.parse(data=f, format=source_format, publicID=base)
        else:
            g.parse(f, format=source_format, publicID=base)
            
        serialization = g.serialize(format=target_format).decode("UTF-8")
        
        # for n3, try to resolve missing prefixes with prefix.cc
        if target_format == "n3" or target_format == "turtle":
            from StringIO import StringIO
            n3_file = StringIO(serialization)
            for line in n3_file.readlines():
                if line.lower().find("@prefix") >= 0:
                    lt = line.find("<")
                    gt = line.find(">")
                    if 0 < lt < gt:
                        url = line[(lt+1):gt].strip()
                        if url in known_vocabs.values(): # try known vocabs first
                            prefixes[known_vocabs.keys()[known_vocabs.values().index(url)]] = url
                        else: # fallback using prefix.cc
                            prefixes = dict(prefixes.items() + getPrefixDict(url)) # add prefix to dict

        # for pretty-xml do the same
        elif target_format == "pretty-xml" or target_format == "xml":
            for m in re.finditer(r"xmlns:[a-zA-Z0-9]+=\"?([^\"]*)", serialization):
                #logging.info(m.group(1))
                url = m.group(1)
                if url in known_vocabs.values(): # try known vocabs first
                    prefixes[known_vocabs.keys()[known_vocabs.values().index(url)]] = url
                else: # fallback using prefix.cc
                    prefixes = dict(prefixes.items() + getPrefixDict(url)) # add prefix to dict

    else:
        prefixes = known_vocabs
    
    g = rdflib.Graph()
        
    for key, value in dict.items(prefixes):
        g.bind(key, value, override=True)
    
    if file_format == "string":
        g.parse(data=f, format=source_format, publicID=base)
    else:
        g.parse(f, format=source_format, publicID=base)
    
    if len(g) > 0:    
        serialization = g.serialize(format=target_format).decode("UTF-8")
        
        if do_pygmentize:
            return pygmentize(serialization, target_format)
        else:
            return serialization
    else:
        return ""
if(len(sys.argv) == 3):
	print "\nConverting RDF File" ,sys.argv[1], "to JSON-LD file",sys.argv[2],"..."
	with open(sys.argv[1], 'r') as i:
		test_json = i.read();
	g = convert(test_json, False, "string", "xml", "json-ld")
	f = open(sys.argv[2], "w")
	f.write(g[14:-2])
	f.close();
	print "Finished!\n"
else:
	print "\nError: No input and/or output.\nUsage: python",sys.argv[0],"[input.rdf] [output.json]\n"
	