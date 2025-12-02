#!/usr/bin/env python3
import random
from datetime import datetime, timedelta

# Sample data
first_names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", 
               "William", "Barbara", "David", "Elizabeth", "Richard", "Susan", "Joseph", "Jessica",
               "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
               "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
               "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle"]

last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
              "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
              "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
              "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
              "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"]

banks = ["Chase Bank", "Wells Fargo", "Bank of America", "Citibank", "US Bank", 
         "PNC Bank", "Capital One", "TD Bank", "Fifth Third Bank", "Regions Bank"]

# Generate file
with open('sample-accounts-1000.txt', 'w') as f:
    # Write header
    f.write("accountNumber|holderName|bankName|balance|lastTransactionDate\n")
    
    # Generate 1000 records
    for i in range(1, 1001):
        account_number = f"ACC{str(i).zfill(7)}"
        holder_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        bank_name = random.choice(banks)
        balance = round(random.uniform(1000, 50000), 2)
        
        # Random date between 2015 and 2021
        start_date = datetime(2015, 1, 1)
        end_date = datetime(2021, 12, 31)
        days_between = (end_date - start_date).days
        random_days = random.randint(0, days_between)
        last_transaction = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
        
        f.write(f"{account_number}|{holder_name}|{bank_name}|{balance}|{last_transaction}\n")

print("Generated sample-accounts-1000.txt with 1000 records!")
