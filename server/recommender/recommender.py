import sys

import pandas as pd
import numpy as np
from ast import literal_eval
from scipy import stats
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from nltk.stem.snowball import SnowballStemmer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import wordnet


md = pd.read_csv('/Users/xiangjieli/Documents/MovieGallery/server/recommender/movies_metadata.csv')
md = md[:1000]
md['genres'] = md['genres'].fillna('[]').apply(literal_eval).apply(lambda x: [i['name'] for i in x] if isinstance(x, list) else [])
md = md[['imdb_id','genres','overview','tagline', 'title']]
md['tagline'] = md['tagline'].fillna('')
md['genres'] = md['genres'].apply(lambda x: ' '.join(str(elm) for elm in x))
md['description'] = md['overview'] + md['tagline'] + md['genres']
md['description'] = md['description'].fillna('')

tf = TfidfVectorizer(analyzer='word',ngram_range=(1, 2),min_df=0, stop_words='english')
tfidf_matrix = tf.fit_transform(md['description'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

md = md.reset_index()
imdbid = md['imdb_id']
indices = pd.Series(md.index, index=md['title'])

def get_recommendations(title):
    if title not in indices.index:
         title = 'Heat'
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[0:10]
    movie_indices = [i[0] for i in sim_scores]
    return imdbid.iloc[movie_indices].tolist()

title = sys.argv[1]
res = get_recommendations(title)
print(res)
sys.stdout.flush()

