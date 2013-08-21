from modeltranslation.translator import translator, TranslationOptions
from geoforms.models import Questionnaire
from geoforms.models import Geoform
from geoforms.models import GeoformElement
from geoforms.models import QuestionnaireForm
from geoforms.models import TextElementModel
from geoforms.models import FormElement
from geoforms.models import Lottery

#geoforms
class QuestionnaireTranslationOptions(TranslationOptions):
    fields = ('name',
              'description',
              )
    
translator.register(Questionnaire, QuestionnaireTranslationOptions)

class GeoformTranslationOptions(TranslationOptions):
    fields = ('name',)
    
translator.register(Geoform, GeoformTranslationOptions)

class GeoformElementTranslationOptions(TranslationOptions):
    fields = ('name',
              'html',)
    
translator.register(GeoformElement, GeoformElementTranslationOptions)
translator.register(TextElementModel, GeoformElementTranslationOptions)

class EmptyTranslationOptions(TranslationOptions):
    fields = ()

translator.register(QuestionnaireForm, EmptyTranslationOptions)
translator.register(FormElement, EmptyTranslationOptions)

class LotteryTranslationOptions(TranslationOptions):
    fields = ('description','thank_you_msg')
    
translator.register(Lottery, LotteryTranslationOptions)
