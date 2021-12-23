import re
import numpy as np
import dictionaries
import csv

# Global sets storing determiners and nouns for comparison 
determiners = []
stems = []
endings = []
determiner_name_to_number = {}
big_stems = []
small_stems = []
ending_mapping = {}
det_to_size_and_plurality = {}
levenshtein_threshold = 1
big_stems_number_to_training_or_testing = {}
small_stems_number_to_training_or_testing = {}

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
    return (matrix[size_x - 1, size_y - 1])

# type: 0 -> determiner 1 -> stem 2 -> ending
def morpheme_levenshtein_comparison(morpheme, threshold, type):
    # Stores the current lowest LD between the morpheme and the possible options
    curr_closest = 1000000

    if(type == 0):
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
    elif (type == 1):
        for i in stems:
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
    elif (type == 2):
        for i in endings:
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
    global det_to_size_and_plurality
    det_to_size_and_plurality = det_map

def obtain_det_names(filename):
    det_names = []
    with open(filename) as csvfile:
        row_reader = csv.reader(csvfile, delimiter=',')
        for row in row_reader:
            # Obtains training/testing designation for big and small neighborhoods
            reg_data = re.findall("det[0-9]+_(?:(?:big)|(?:small))[0-9]+[ps]",row[2])
            big_or_small = re.findall("(?:(?:big)|(?:small))",reg_data[0])[0]
            monster_num = int(re.findall("[0-9]+",reg_data[0])[1])
            if (big_or_small == 'big'):
                big_stems_number_to_training_or_testing[monster_num] = row[5]
            else:
                small_stems_number_to_training_or_testing[monster_num] = row[5]
            det_names.append(row[2])
            det_names.append(row[3])
    return det_names



# Determines the mapping from names of determiners, stems and endings to their numbers, plurality, and 
# neighborhood and updates global maps
# IMPORTANT NOTE: filename must be a csv file, if not, change to csv in excel first then call this
def det_stem_ending_mapping(filename):
    with open(filename) as csvfile:
        row_reader = csv.reader(csvfile, delimiter=',')
        for row in row_reader:
            # map determiners
            if("det" in row[0]):
                test_number = re.compile('det[1-4]')
                if(test_number.match(row[0]) != None):
                    find_number = re.compile("\d")
                    determiner_name_to_number[row[1]] = int(find_number.findall(row[0])[0])
                    determiners.append(row[1])
            # map big neighborhood
            if("big" in row[2]):
                test_number = re.compile('big\d')
                if(test_number.match(row[2]) != None):
                    big_stems.append(row[3])
                    stems.append(row[3])
            # map small neighborhood
            if("small" in row[4]):
                test_number = re.compile('small\d')
                if(test_number.match(row[4]) != None):
                    small_stems.append(row[5])
                    stems.append(row[5])
            # map ending plurality
            if("big" in row[7]):
                ending_mapping[row[8]] = ('big', 's')
                ending_mapping[row[9]] = ('big', 'p')
                endings.append(row[8])
                endings.append(row[9])
            if("small" in row[7]):
                ending_mapping[row[8]] = ('small', 's')
                ending_mapping[row[9]] = ('small', 'p')
                endings.append(row[8])
                endings.append(row[9])
                    
            
            

# This function will return a 2x2 list of strings that is structured as the table appears in page 4 of the
# "instructions and codebooks" document. The table will only have the first 2 rows filled out, as 
# This is enough to extrapolate sufficient information to obtain the next 3 rows, which will be performed
# in a different function
def get_initial_table(filename):
    table = []
    with open(filename) as csvfile:
        row_reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in row_reader:
            if('typed_response' in row[4]):
                pass
            else:
                typed_response = row[4]
                target_response = row[5]
                # add row to table, add contents as first 2 entries to list
                table.append([])
                table[len(table)-1].append(typed_response)
                table[len(table)-1].append(target_response)
    return(table)

def fill_out_table(initial_table):
    for row in initial_table:
        typed_response = split_by_regex(row[0])
        # NOTE: this part of the code relies on the expected response to be properly split by regex, 
        # in testing, this was always the case 
        expected_response = split_by_regex(row[1])
        
        if(typed_response[0] == None):
            row.append("couldn't")
            row.append("parse")
            row.append("syllables")
        else:
            

        # Determiner analysis
            correct_det = morpheme_levenshtein_comparison(expected_response[0], 1, 0)
            det_analysis = morpheme_levenshtein_comparison(typed_response[0], 1, 0)
            if(correct_det[0] == -1):
                print("PROBLEM: correct value did not map, check levenshtein threshold")
                exit(0)
                pass
            if(det_analysis[0] == -1):
                row.append("unmappable: "+det_analysis[1])
            elif(det_analysis[1] == correct_det[1]):
                row.append("correct")
            else:
                row.append(det_to_size_and_plurality[determiner_name_to_number[det_analysis[1]]])
        # Stem analysis
            correct_stem = morpheme_levenshtein_comparison(expected_response[1], 1, 1)
            stem_analysis = morpheme_levenshtein_comparison(typed_response[1], 1, 1)

            # IMPORTANT NOTE: I had to change "burr" in language_pilot5 to "bur", it does not like that 
            # the unconnected ending has 2 rs, and also that isn't really necessary
            if(correct_stem[0] == -1):
                print("PROBLEM: correct value did not map, check levenshtein threshold")
                exit(0)
                pass
            if(stem_analysis[0] == -1):
                row.append("unmappable: "+stem_analysis[1])
            elif(stem_analysis[1] == correct_stem[1]):
                row.append("correct")
            else:
                to_comp = stem_analysis[1]
                if(to_comp in big_stems):
                    monster_number = big_stems.index(to_comp)
                    row.append("big "+big_stems_number_to_training_or_testing[monster_number])
                else:
                    monster_number = small_stems.index(to_comp)
                    row.append("small "+small_stems_number_to_training_or_testing[monster_number])
        # Ending analysis
            correct_ending = morpheme_levenshtein_comparison(expected_response[2], 1, 2)
            ending_analysis = morpheme_levenshtein_comparison(typed_response[2], 1, 2)
            if(correct_ending[0] == -1):
                print("PROBLEM: correct value did not map, check levenshtein threshold")
                exit(0)
                pass
            if(ending_analysis[0] == -1):
                row.append("unmappable: "+ending_analysis[1])
            elif(ending_analysis[1] == correct_ending[1]):
                row.append("correct")
            else:
                row.append(ending_mapping[ending_analysis[1]])
    return initial_table

        

def retrieve_results(morpheme_map_file, setup_file, data_file, output_file):
    det_stem_ending_mapping(morpheme_map_file)
    det_names = obtain_det_names(setup_file)
    determiner_assignment(det_names)
    data_table = get_initial_table(data_file)
    table = fill_out_table(data_table)
    with open(output_file, 'w') as f: 
        details = ["typed_response", "target_response", "typed_det", "typed_stem", "typed_ending"]
        write = csv.writer(f) 
        write.writerow(details) 
        write.writerows(table) 

#det_stem_ending_mapping("language_pilot5.csv")
#det_names = obtain_det_names("s_71993_setup.csv")
#determiner_assignment(det_names)
#data_table = get_initial_table("production_test_data_pilot5.csv")
#fill_out_table(data_table)
morpheme_map_file = "language_pilot5.csv"
setup_file = "s_71993_setup.csv"
data_file = "production_test_data_pilot5.csv"
output_file = "output.csv"
retrieve_results(morpheme_map_file, setup_file, data_file, output_file)