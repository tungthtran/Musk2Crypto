import sys
import nltk

from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer, WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from textblob import TextBlob

nltk.download("stopwords")
nltk.download("wordnet")
stop_words = stopwords.words("english")
stemmer = SnowballStemmer("english", ignore_stopwords=True)
lemmatizer = WordNetLemmatizer()
tokenizer = RegexpTokenizer(r"\w+")

def preprocess(text):
    tokenized_text = tokenizer.tokenize(text.lower())
    # lemmatize the text
    words = [lemmatizer.lemmatize(w) for w in tokenized_text if w not in stop_words]
    # stem the text
    stem_text = " ".join([stemmer.stem(i) for i in words])
    return stem_text

def analyze():    
    text = sys.argv[1]
    stem_text = preprocess(text)
    testimonial = TextBlob(stem_text)
    print(testimonial.sentiment.polarity)
    sys.stdout.flush()
