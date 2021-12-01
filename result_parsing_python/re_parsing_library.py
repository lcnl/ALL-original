import re
import numpy as np
import dictionaries

# Global sets storing determiners and nouns for comparison 
determiners = []
nouns = []

def split_by_regex(response):
    split_string = re.split(" ",response)
    
    # Case of single string
    if(len(split_string) == 1):
        return (single_string_parse(split_string))
    if(len(split_string) == 2):
        return (two_string_parse(split_string))    
    if(len(split_string) == 3):
        return (three_string_parse(split_string))
    
    # greater than 3 or empty string, return sentinel value
    return (None,None,None)

# Considers the first string to be the determiner and tries to split the second string into syllables 
def two_string_parse(response):
    contains_something = re.search("something",response[1])
    
    # Checks for the word "something" in the noun. If found, checks for a suffix, if found, it splits, otherwise, returns sentinel value (None,None,None)
    if(contains_something):
        split_something = re.split("something", response[1])
        
        if(split_something[1] == ''):
            return (None,None,None)
        return (response[0], "something",split_something[1])
    noun = response[1]
    
    # This regex searches for [consonant cluster][vowel cluster][consonant cluster]. If found, it splits this into the first syllable and returns (determiner, first syllable, second syllable)

    if(re.findall("[b-df-hj-np-tv-z]+[aeiou]+[b-df-hj-np-tv-z]+", noun)):
        first_syllable = re.findall("[b-df-hj-np-tv-z]+[aeiou]+[b-df-hj-np-tv-z]+", noun)[0]
        second_syllable = re.split("[b-df-hj-np-tv-z]+[aeiou]+[b-df-hj-np-tv-z]+", noun,1)[1]
        return (response[0],first_syllable, second_syllable)
    # Case where we couldn't parse syllables
    else:
        return (None,None,None)
    
# If a single string was entered, we attempt to parse the string as a determiner or a noun by passing in (string, string) to the 2 string function
def single_string_parse(response):
    return two_string_parse([response[0], response[0]])

# Concatenates second and third string entry and considers first entry to be determiner
def three_string_parse(response):
    return two_string_parse([response[0], response[1]+response[2]])

def levenshtein(seq1, seq2):
    size_x = len(seq1) + 1
    size_y = len(seq2) + 1
    matrix = np.zeros ((size_x, size_y))
    for x in xrange(size_x):
        matrix [x, 0] = x
    for y in xrange(size_y):
        matrix [0, y] = y

    for x in xrange(1, size_x):
        for y in xrange(1, size_y):
            if seq1[x-1] == seq2[y-1]:
                matrix [x,y] = min(
                    matrix[x-1, y] + 1,
                    matrix[x-1, y-1],
                    matrix[x, y-1] + 1
                )
            else:
                matrix [x,y] = min(
                    matrix[x-1,y] + 1,
                    matrix[x-1,y-1] + 1,
                    matrix[x,y-1] + 1
                )
    print (matrix)
    return (matrix[size_x - 1, size_y - 1])

def morpheme_levenshtein_comparison(morpheme, threshold, is_determiner):
    # Stores the current lowest LD between the morpheme and the possible options
    curr_closest = 1000000

    if(is_determiner):
        for i in determiners:
            if (levenshtein(morpheme, i) == curr_closest):
                # Unmappable, 0 indicates that morpheme is not gibberish, needs human inspect
                return (0, morpheme)
            if(levenshtein(morpheme, i) < threshold and levenshtein(morpheme, i) < curr_closest):
                curr_closest = levenshtein(morpheme, i)
                curr_best = i

        # Mapped to nothing because every LD higher than threshold, -1 indicates gibberish
        if (curr_closest == 1000000):
            return (-1, morpheme)
        
        # Mapped successfully, return 1 indicating success and the mapped morpheme
        return (1, curr_best)
    else:
        for i in nouns:
            if (levenshtein(morpheme, i) == curr_closest):
                # Unmappable, 0 indicates that morpheme is not gibberish, needs human inspect
                return (0, morpheme)
            if(levenshtein(morpheme, i) < threshold and levenshtein(morpheme, i) < curr_closest):
                curr_closest = levenshtein(morpheme, i)
                curr_best = i

        # Mapped to nothing because every LD higher than threshold, -1 indicates gibberish
        if (curr_closest == 1000000):
            return (-1, morpheme)
        
        # Mapped successfully, return 1 indicating success and the mapped morpheme
        return (1, curr_best)

def determiner_assignment(det_names):

    # Maps determiners to their data
    det_map = {}
    for det in det_names:
        reg_data = re.findall("det[0-9]+_(?:(?:big)|(?:small))[0-9]+[ps]",det)
        if(reg_data):
            # Big or small
            big_or_small = re.findall("(?:(?:big)|(?:small))",reg_data[0])[0]
            
            # Determines plurality given input string
            number_and_plurality = re.findall("[0-9]+[ps]+",reg_data[0])[0]
            p_or_s = re.findall("[ps]+",number_and_plurality)[0]
            
            # Determines number for determiner
            det_number = int(re.findall("[0-9]+",reg_data[0])[0])

            # Maps determiner to its assignment in tuple form i.e. 1: ("big", "p")
            det_map[det_number] = (big_or_small, p_or_s)
        else:
            # Invalid input, bad news 
            return -1
    return det_map
print(determiner_assignment(["det1_big2p.wav","det2_small2p.wav","det3_big2s.wav","det4_small2s.wav"]))