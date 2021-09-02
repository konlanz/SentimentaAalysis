import sys
import twint

# Configure
c = twint.Config()
#uname = str(sys.argv[1]) 
uname = 'mellowfmlive'
c.Pandas = True
c.Pandas_clean = True
c.Username = uname
c.Limit = 1000
twint.run.Profile(c)

