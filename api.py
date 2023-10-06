from parrot import Parrot
import torch
import warnings
import nltk
from transformers import pipeline
from nltk.tokenize import sent_tokenize
from deepmultilingualpunctuation import PunctuationModel


class parrotAPI():

    def __init__(self) -> None:
        warnings.filterwarnings("ignore")
        nltk.download('punkt')

        self.model = PunctuationModel()
        self.parrot = Parrot(model_tag="prithivida/parrot_paraphraser_on_T5")
        self.ner = pipeline('ner')


    def _process_blank_space(self, paragraph: str) -> str:

        while paragraph[0] == ' ':
                paragraph = list(paragraph)
                paragraph = paragraph[1:]
                paragraph = ''.join(paragraph)

        while paragraph[-1] == ' ':
                paragraph = list(paragraph)
                paragraph = paragraph[:-1]
                paragraph = ''.join(paragraph)

        return paragraph


    def _pre_process(self, paragraph: str) -> any:

        paragraph = paragraph.replace('\n','')
        paragraph = self._process_blank_space(paragraph)

        return paragraph, sent_tokenize(paragraph)

    def _transfer_sentence(self, original_sentence: str, ad_num: float, fl_num: float, do_diverse: bool) -> dict:
        
        another_sentence = self.parrot.augment(input_phrase=original_sentence, adequacy_threshold=ad_num, fluency_threshold=fl_num, do_diverse=do_diverse)
        
        if another_sentence is not None:
            for i in range(0, len(another_sentence)):
                another_sentence[i] = self._post_process(original_sentence, another_sentence[i][0])

        return {original_sentence: another_sentence}

    def _post_process(self, origin_sentence: str, transfer_sentence: str) -> str:

        # first word is uppercase
        for i in range(0, len(transfer_sentence)): 
            if transfer_sentence[i].isalpha():
                transfer_sentence = list(transfer_sentence)
                transfer_sentence[i] = transfer_sentence[i].upper()
                transfer_sentence = ''.join(transfer_sentence)
                break

        # token classification
        entities = self.ner(origin_sentence, aggregation_strategy="simple")

        for word in entities:
            transfer_sentence = transfer_sentence.replace(word['word'].lower(), word['word'])

        # month and week
        replace_list = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        for word in replace_list:
            transfer_sentence = transfer_sentence.replace(word.lower(), word)

        # I
        if transfer_sentence[-3: -1] == ' i':
            transfer_sentence = list(transfer_sentence)
            transfer_sentence[-1] = 'I'
            transfer_sentence = ''.join(transfer_sentence)

        transfer_sentence = transfer_sentence.replace(' i ', ' I ')

        # blank space
        transfer_sentence = transfer_sentence.replace('  ', ' ')
        transfer_sentence = self._process_blank_space(transfer_sentence)
        
                
        # punctuation
        transfer_sentence = self.model.restore_punctuation(transfer_sentence)


        return transfer_sentence

    def __call__(self, paragraph: str, ad_num: float = 0.9, fl_num: float = 0.9, do_diverse: bool = True):

        transfer_sentences = dict()
        paragraph, sentences = self._pre_process(paragraph)

        for _sentence in sentences:

            temp_dict = self._transfer_sentence(_sentence, ad_num, fl_num, do_diverse)
            print(temp_dict)
            if len(temp_dict[_sentence]) != 0 and not (len(temp_dict[_sentence]) == 1 and temp_dict[_sentence][0] == _sentence):
                transfer_sentences.update(temp_dict)
            print(transfer_sentences)

        return transfer_sentences
        
    
if __name__ == '__main__':
    api = parrotAPI()
    print(api('''
    A team of Harvard researchers found that keeping fresh flowers at home does wonders in keeping away anxiety and negative moods. People in the study also felt more compassionate toward others and they felt a boost of energy and enthusiasm at work.
    '''))