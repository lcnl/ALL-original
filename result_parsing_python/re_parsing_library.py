import re

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