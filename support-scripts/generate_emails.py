import Jinja2
import csv

with open('guests.csv') as csvfile:
	reader = csv.DictReader(csvfile)	
	households = {}
	for row in reader:
		print(row[u'first_name'], row[u'last_name'])

		household_id = unicode(row[u'household'])
		if household_id not in households:
			households[household_id] = {
				'household_name': unicode(row[u'household_name']),
				'greeting': unicode(row[u'greeting']),
				'members': [{
					'first_name': unicode(row[u'first_name']),
					'last_name': unicode(row[u'last_name']),
					'plus_one': unicode(row[u'plus_one']) == u'TRUE',
					'email': unicode(row[u'email'])
				}]
			}
		else:
			households[household_id][u'members'].append({
					'first_name': unicode(row[u'first_name']),
					'last_name': unicode(row[u'last_name']),
					'plus_one': unicode(row[u'plus_one']) == u'TRUE',
					'email': unicode(row[u'email'])
				})




