from django import forms
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import *

class ContactForm(forms.Form):
	name= forms.CharField(max_length=45)
	email= forms.EmailField()
	country= forms.CharField(max_length=30)
	message= forms.CharField(widget=forms.Textarea)

class RequestForm(forms.Form):
    email = forms.EmailField(required=True)
    amount = forms.FloatField(required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)

class RetirementDepositForm(forms.Form):

	CHOICES= ( ('0.000136986301#Retirement/Retire within 1 to 7 years (2555 days)#2555', '0.000136986301#Retirement/Retire within 1 to 7 years (2555 days)#2555'),
		('0.00004566#Retirement/Retire within 15 years (5475 days)#5475', '0.00004566#Retirement/Retire within 15 years (5475 days)#5475'),
		('0.00001044#Retirement/Retire within 25 to 35 years#10680', '0.00001044#Retirement/Retire within 25 to 35 years#10680'),
		('0.000005097#Retirement/Retire within 35 to 50 years#15695', '0.000005097#Retirement/Retire within 35 to 50 years#15695'),
		)

	CURRENCY= ( ('USDTTRC20', 'USDTTRC20'),
		('btc', 'btc'),
		('eth', 'eth'),
		('doge', 'doge'),
		('trx', 'trx'),
		('sol', 'sol'),
		('ltc', 'ltc'),
		('dot', 'dot'),
		('XLM', 'XLM'),
		('ADA', 'ADA'),
		('axs', 'axs'),
		('floki', 'floki'),
		('busderc20', 'busderc20'),
		('dash', 'dash'),
		('etc', 'etc'),
		('xmr', 'xmr'),
		('bnbbsc', 'bnbbsc'),
		('shib', 'shib'),
		('bch', 'bch'),
		('xrp', 'xrp'), )

	investment_plan= forms.ChoiceField(choices=CHOICES, required=True)
	amount= forms.FloatField(required= True)
	pay_currency= forms.ChoiceField(choices=CURRENCY, required=True)

class RealestateDepositForm(forms.Form):

	CHOICES= ( ('0.011112#Realestate / land holdings#180', '0.011112#Realestate / landed holdings #180'),
		('0.00370370373#Realestate /Residential properties#540', '0.00370370373#Realestate /Residential properties#540'),
		('0.00277777778#Realestate /Commercial properties#720', '0.00370370373#Realestate /Commercial properties#720') )

	CURRENCY= ( ('USDTTRC20', 'USDTTRC20'),
		('btc', 'btc'),
		('eth', 'eth'),
		('doge', 'doge'),
		('trx', 'trx'),
		('sol', 'sol'),
		('ltc', 'ltc'),
		('dot', 'dot'),
		('XLM', 'XLM'),
		('ADA', 'ADA'),
		('axs', 'axs'),
		('floki', 'floki'),
		('busderc20', 'busderc20'),
		('dash', 'dash'),
		('etc', 'etc'),
		('xmr', 'xmr'),
		('bnbbsc', 'bnbbsc'),
		('shib', 'shib'),
		('bch', 'bch'),
		('xrp', 'xrp'), )

	investment_plan= forms.ChoiceField(choices=CHOICES, required=True)
	amount= forms.FloatField(required= True)
	pay_currency= forms.ChoiceField(choices=CURRENCY, required=True)

class CryptoDepositForm(forms.Form):

	CHOICES= ( ('0.0083333#Crypocurrency / Digital asset management#30', '0.0083333#Crypocurrency / Digital asset management#30'),
		('0.0017534#Staking / Stake Crypto #365', '0.0017534#Staking / Stake Crypto #365'),
		#('0.0017534#Staking / Doge#365', '0.021333#Staking / Doge #365'),
		#('0.0017534#Staking / ADA#365', '0.021333#Staking / ADA#365'),
		#('0.0017534#Staking / Ripple#365', '0.021333#Staking / Ripple#365'),
		)

	CURRENCY= ( ('USDTTRC20', 'USDTTRC20'),
		('btc', 'btc'),
		('eth', 'eth'),
		('doge', 'doge'),
		('trx', 'trx'),
		('sol', 'sol'),
		('ltc', 'ltc'),
		('dot', 'dot'),
		('XLM', 'XLM'),
		('ADA', 'ADA'),
		('axs', 'axs'),
		('floki', 'floki'),
		('busderc20', 'busderc20'),
		('dash', 'dash'),
		('etc', 'etc'),
		('xmr', 'xmr'),
		('bnbbsc', 'bnbbsc'),
		('shib', 'shib'),
		('bch', 'bch'),
		('xrp', 'xrp'), )
	investment_plan= forms.ChoiceField(choices=CHOICES, required=True)
	amount= forms.FloatField(required= True)
	pay_currency= forms.ChoiceField(choices=CURRENCY, required=True)

class StocksDepositForm(forms.Form):

	CHOICES= ( ('0.007143#Stocks / Tech#7', '0.007143#Stocks / Tech#7'),
		('0.0042857#Stocks / Energy#7', '0.0042857#Stocks / Energy#7'),
		('0.0014286#Stocks / Financial Services#7', '0.0014286#Stocks / Financial Services#7')
		)

	CURRENCY= ( ('USDTTRC20', 'USDTTRC20'),
		('btc', 'btc'),
		('eth', 'eth'),
		('doge', 'doge'),
		('trx', 'trx'),
		('sol', 'sol'),
		('ltc', 'ltc'),
		('dot', 'dot'),
		('XLM', 'XLM'),
		('ADA', 'ADA'),
		('axs', 'axs'),
		('floki', 'floki'),
		('busderc20', 'busderc20'),
		('dash', 'dash'),
		('etc', 'etc'),
		('xmr', 'xmr'),
		('bnbbsc', 'bnbbsc'),
		('shib', 'shib'),
		('bch', 'bch'),
		('xrp', 'xrp'), )

	investment_plan= forms.ChoiceField(choices=CHOICES, required=True)
	amount= forms.FloatField(required= True)
	pay_currency= forms.ChoiceField(choices=CURRENCY, required=True)

class PortfolioDepositForm(forms.Form):

	CHOICES= ( ('0.005#Portfolio management/ Starter package#30', '0.005#Portfolio management/ Starter package#30'),
		('0.004#Portfolio management/ Standard package#30', '0.004#Portfolio management/ Standard package#30'),
		('0.01167#Portfolio management/ Premium package#30', '0.01167#Portfolio management/ Premium package#30'),
		('0.0067#Portfolio management/ Gold package#30', '0.0067#Portfolio management/ Gold package#30'),
		('0.033#Portfolio management/ Executive package/ NFP#90', '0.033#Portfolio management/ Executive package/ NFP#90'),
		('0.067#Portfolio management/ Executive package/ MMA#30', '0.067#Portfolio management/ Executive package/ MMA#30'),
		('0.00556#Portfolio management/ Executive package/ FOMC#180', '0.00556#Portfolio management/ Executive package/ FOMC#180'),
		)

	CURRENCY= ( ('USDTTRC20', 'USDTTRC20'),
		('btc', 'btc'),
		('eth', 'eth'),
		('doge', 'doge'),
		('trx', 'trx'),
		('sol', 'sol'),
		('ltc', 'ltc'),
		('dot', 'dot'),
		('XLM', 'XLM'),
		('ADA', 'ADA'),
		('axs', 'axs'),
		('floki', 'floki'),
		('busderc20', 'busderc20'),
		('dash', 'dash'),
		('etc', 'etc'),
		('xmr', 'xmr'),
		('bnbbsc', 'bnbbsc'),
		('shib', 'shib'),
		('bch', 'bch'),
		('xrp', 'xrp'), )

	investment_plan= forms.ChoiceField(choices=CHOICES, required=True)
	amount= forms.FloatField(required= True)
	pay_currency= forms.ChoiceField(choices=CURRENCY, required=True)

class BonusForm(ModelForm):
	class Meta:
		model= Bonus
		fields= '__all__'

class CreateUserForm(UserCreationForm):
	class Meta:
		model = User
		fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']

class ClientForm(ModelForm):
	class Meta:
		model= Client
		fields= '__all__'
		exclude= ['user','code', 'recommended_by', 'deposit', 'balance', 'withdrawal', 'profit','roi', 'running_days']



