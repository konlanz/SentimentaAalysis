import sys
import twint
c = twint.Config()
c.Search = "datascience"
c.Limit = 1000
c.Pandas = True
c.Pandas_clean = True
twint.run.Search(c)
print(twint.output.panda.Tweets_df[["tweet"]])
