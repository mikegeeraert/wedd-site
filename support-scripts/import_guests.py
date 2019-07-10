import csv
from google.cloud import firestore


db = firestore.Client()

households_collection_ref = db.collection(u'households')
guests_collection_ref = db.collection(u'guests')
# Read csv into a tree structure
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

# traverse households Breadth first and add to firestore
for household_id in households:
	try:
		result = households_collection_ref.add({
				u'name': households[household_id][u'household_name'],
				u'greeting': households[household_id][u'greeting']
			})
		household_doc_ref = result[1].id
		print household_doc_ref
	except any as e:
		print 'Error adding household' + e
	print households[household_id]
	for member in households[household_id][u'members']:
		try:
			guests_collection_ref.add({
					u'householdId': household_doc_ref,
					u'first': member[u'first_name'],
					u'last' : member[u'last_name'],
					u'allowedPlusOne': member[u'plus_one'],
					u'email': member[u'email'],
					u'type': u'invitee'
				})
		except any as e:
			print 'Error adding member to household' + e