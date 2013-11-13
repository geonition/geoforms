import abc
from bs4 import BeautifulSoup
from datetime import datetime
from django import forms
from django.conf import settings
from django.forms.formsets import BaseFormSet
from django.forms.models import BaseModelFormSet
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext_lazy as _
from geoforms.fields import TranslationField
from geoforms.models import CheckboxElementModel
from geoforms.models import DrawbuttonElementModel
from geoforms.models import Geoform
from geoforms.models import GeoformElement
from geoforms.models import NumberElementModel
from geoforms.models import ParagraphElementModel
from geoforms.models import RadioElementModel
from geoforms.models import TextElementModel
from geoforms.models import TextareaModel
from geoforms.models import RangeElementModel
from geoforms.models import SelectElementModel
from geoforms.widgets import CheckboxElement
from geoforms.widgets import ColorInput
from geoforms.widgets import Drawbutton
from geoforms.widgets import NumberElement
from geoforms.widgets import RadiobuttonElement
from geoforms.widgets import Paragraph
from geoforms.widgets import TextElement
from geoforms.widgets import TextareaElement
from geoforms.widgets import TranslationWidget
from geoforms.widgets import RangeElement

from django.forms.widgets import Select
from django.forms import BooleanField
from geoforms.models import LotteryParticipant


#element admin forms
class ElementForm(forms.ModelForm):
    """
    This is a base class for input elements
    of the form <label>label <input .../></label>
    """

    question = TranslationField(label = _('question'))

    def __init__(self, *args, **kwargs):
        """
        The init function parses through the saved
        html and sets the correct initial
        values for the form.
        """

        super(ElementForm, self).__init__(*args, **kwargs)

        # Set the form fields based on the model object
        if kwargs.has_key('instance'):
            initial_values = []
            for lang in settings.LANGUAGES:
                html = getattr(kwargs['instance'],'html_%s' % lang[0])
                if html == None:
                    html = getattr(kwargs['instance'],'html_%s' % settings.LANGUAGES[0][0])
                soup = BeautifulSoup(html)
                initial_values.append(soup.label.text)

            self.initial['question'] = initial_values

    def save(self, commit=True):
        """
        This function saves the elements
        """
        model = super(ElementForm, self).save(commit=False)

        if self.is_valid():
            name = self.cleaned_data['question'][0].replace(' ', '-')[:190]

            for i, lang in enumerate(settings.LANGUAGES):
                question = self.cleaned_data['question'][i]
                if not question:
                    question = self.cleaned_data['question'][0]
                gen_html = self.render(question,
                                       name,
                                       '')
                setattr(model, 'html_%s' % lang[0],
                        gen_html)
                setattr(model, 'name_%s' % lang[0],
                        self.cleaned_data['question'][i])

        # Save the fields
        if commit:
            model.save()

        return model

    @abc.abstractmethod
    def render(self,
               question,
               name,
               value):
        """
        This function has to be overridden to
        render the element
        """
        return ''

class TextElementForm(ElementForm):
    """
    This modelform is used in the admin to
    be able to add textinputs and
    also modify them.
    """

    def render(self, question, name, value):
        return TextElement().render(question,
                                    name,
                                    value)

    class Meta:
        model = TextElementModel
        fields = ('question',)

class TextareaForm(ElementForm):
    """
    This handled creation of Textarea questions
    """

    def render(self, question, name, value):
        return TextareaElement().render(question,
                                        name,
                                        value)

    class Meta:
        model = TextareaModel
        fields = ('question',)

class NumberElementForm(ElementForm):

    min_value = forms.IntegerField(initial = 0, label = _('minimum value'))
    max_value = forms.IntegerField(initial = 1000, label = _('maximum value'))
    step = forms.FloatField(initial = 1, label = _('size for one step'))

    def __init__(self, *args, **kwargs):
        """
        The init function parses through the saved
        html and sets the correct initial
        values for the form.
        """
        super(NumberElementForm, self).__init__(*args, **kwargs)

        # Set the form fields based on the model object
        if kwargs.has_key('instance'):
            question = []
            min_value = 0
            max_value = 1000
            step = 1
            for lang in settings.LANGUAGES:
                html = getattr(kwargs['instance'],'html_%s' % lang[0])
                if html == None:
                    html = getattr(kwargs['instance'],'html_%s' % settings.LANGUAGES[0][0])
                soup = BeautifulSoup(html)
                question.append(soup.label.text)

                min_value = soup.input.get('min', 0)
                max_value = soup.input.get('max', 1000)
                step = soup.input.get('step', 1)

            self.initial['question'] = question
            self.initial['min_value'] = min_value
            self.initial['max_value'] = max_value
            self.initial['step'] = step

    def render(self, question, name, value, attrs = {}):
        return NumberElement().render(question,
                                      name,
                                      value,
                                      attrs = attrs)



    def save(self, commit=True):
        model = super(NumberElementForm, self).save(commit=False)

        if self.is_valid():
            question = self.cleaned_data['question']

            name = slugify("number-" + question[0][:190])

            value = ''
            for i, lang in enumerate(settings.LANGUAGES):
                lang_q = question[i]
                if not lang_q:
                    lang_q = question[0]
                gen_html = NumberElement().render(lang_q,
                                                  name,
                                                  value,
                                                  attrs = {
                                                    'min': self.cleaned_data['min_value'],
                                                    'max': self.cleaned_data['max_value'],
                                                    'step': self.cleaned_data['step']
                                                    })
                setattr(model,
                        'html_%s' % lang[0],
                        gen_html)
                setattr(model,
                        'name_%s' % lang[0],
                        lang_q[:190])

        if commit:
            model.save()

        return model

    class Meta:
        model = NumberElementModel
        fields = ('question',
                  'min_value',
                  'max_value',
                  'step')

class RangeElementForm(forms.ModelForm):
    question = TranslationField(label = _('question'), required=False)
    min_label = TranslationField(label = _('label for minimum choice'))
    max_label = TranslationField(label = _('label for maximum choice'))
    initial_value = forms.FloatField(initial = 50.12, label = _('initial value'))
    min_value = forms.IntegerField(initial = 0, label = _('minimum value'))
    max_value = forms.IntegerField(initial = 100, label = _('maximum value'))
    step = forms.FloatField(initial = 0.01, label = _('size for one step'))

    def __init__(self, *args, **kwargs):
        """
        The init function parses through the saved
        html and sets the correct initial
        values for the form.
        """
        super(RangeElementForm, self).__init__(*args, **kwargs)

        # Set the form fields based on the model object
        if kwargs.has_key('instance'):
            question = []
            min_label = []
            max_label = []
            initial_value = 50.12
            min_value = 0
            max_value = 100
            step = 0.01
            for lang in settings.LANGUAGES:
                html = getattr(kwargs['instance'],'html_%s' % lang[0])
                if html == None:
                    html = getattr(kwargs['instance'],'html_%s' % settings.LANGUAGES[0][0])
                soup = BeautifulSoup(html)
                if soup.p:
                    question.append(soup.p.text)
                else:
                    question.append('')
                min_label.append(soup.span.text)
                max_label.append(soup.span.next_sibling.next_sibling.text)

                initial_value = soup.input.get('value', 50.12)
                min_value = soup.input.get('min', 0)
                max_value = soup.input.get('max', 100)
                step = soup.input.get('step', 0.01)

            self.initial['question'] = question
            self.initial['min_label'] = min_label
            self.initial['max_label'] = max_label
            self.initial['initial_value'] = initial_value
            self.initial['min_value'] = min_value
            self.initial['max_value'] = max_value
            self.initial['step'] = step


    def render(self, question, min_label, max_label, name, value, attrs = {}):
        return RangeElement().render(question,
                                     min_label,
                                     max_label,
                                     name,
                                     value,
                                     attrs = attrs)



    def save(self, commit=True):
        model = super(RangeElementForm, self).save(commit=False)

        if self.is_valid():
            question = self.cleaned_data['question']
            min_label = self.cleaned_data['min_label']
            max_label = self.cleaned_data['max_label']

            if not question:
                question = ['']* len(settings.LANGUAGES)
                name = slugify('range-min-' + min_label[0][:190])
            else:
                name = slugify('range-' + question[0][:190])

            value = ''
            for i, lang in enumerate(settings.LANGUAGES):
                lang_question = question[i]
                lang_min_label = min_label[i]
                lang_max_label = max_label[i]
                if not lang_min_label:
                    lang_min_label = min_label[0]
                if not lang_max_label:
                    lang_max_label = max_label[0]
                if not lang_question:
                    if question[0]: # question can be empty for range elements
                        lang_question = question[0]
                gen_html = RangeElement().render(lang_question,
                                                 lang_min_label,
                                                 lang_max_label,
                                                 name,
                                                 value,
                                                 attrs = {
                                                    'min': self.cleaned_data['min_value'],
                                                    'max': self.cleaned_data['max_value'],
                                                    'step': self.cleaned_data['step'],
                                                    'value': self.cleaned_data['initial_value']
                                                    })
                setattr(model,
                        'html_%s' % lang[0],
                        gen_html)
                if question[i] != '':
                    local_name = question[i][:200]
                else:
                    local_name = min_label[i][:200]
                setattr(model,
                        'name_%s' % lang[0],
                        local_name)

        if commit:
            model.save()

        return model

    class Meta:
        model = RangeElementModel
        fields = ('question',
                  'min_label',
                  'max_label',
                  'min_value',
                  'max_value',
                  'step',
                  'initial_value')

class RadioElementForm(forms.ModelForm):
    label = TranslationField(label = _('option'))

    class Meta:
        model = RadioElementModel
        fields = ('label',)

class RadioElementFormSet(BaseFormSet):
    """
    Radio elements needs to be saved at one time
    """

    def __init__(self, *args, **kwargs):
        super(RadioElementFormSet, self).__init__(*args, **kwargs)

    def save(self):
        qform = QuestionForm(self.data)
        model_values = {}
        name = ''
        randomize = False
        if qform.is_valid():
            name = slugify(qform.cleaned_data['question'][0])
            randomize = qform.cleaned_data['randomize']
            for i, lang in enumerate(settings.LANGUAGES):
                lang_question = qform.cleaned_data['question'][i]
                if not lang_question:
                    lang_question = qform.cleaned_data['question'][0]
                model_values['html_%s' % lang[0]] = '<p>%s</p>' % lang_question
                model_values['name_%s' % lang[0]] = lang_question

        attrs = {'data-random': 'true'} if randomize else {}
        for form in self.forms:

            if form.is_valid():
                default_lang_label = form.cleaned_data['label'][0]
                for i, lang in enumerate(settings.LANGUAGES):
                    lang_label = form.cleaned_data['label'][i]
                    if not lang_label:
                        lang_label = default_lang_label
                    model_values['html_%s' % lang[0]] += RadiobuttonElement().render(lang_label,
                                                                                     name,
                                                                                     slugify(default_lang_label),
                                                                                     attrs)
        if self.data.has_key('id'):
            model_values['id'] = self.data['id']

        RadioElementModel(**model_values).save()

class CheckboxElementForm(forms.ModelForm):
    label = TranslationField(label = _('option'))

    class Meta:
        model = CheckboxElementModel
        fields = ('label',)

class CheckboxElementFormSet(BaseFormSet):
    """
    Checkbox elements needs to be saved at one time
    """

    def save(self):
        qform = QuestionForm(self.data)
        model_values = {}
        name = ''
        randomize = False
        if qform.is_valid():
            name = slugify(qform.cleaned_data['question'][0])
            randomize = qform.cleaned_data['randomize']
            for i, lang in enumerate(settings.LANGUAGES):
                lang_question = qform.cleaned_data['question'][i]
                if not lang_question:
                    lang_question = qform.cleaned_data['question'][0]
                model_values['html_%s' % lang[0]] = '<p>%s</p>' % lang_question
                model_values['name_%s' % lang[0]] = lang_question
        attrs = {'data-random': 'true'} if randomize else {}
        for form in self.forms:

            if form.is_valid():
                default_lang_label = form.cleaned_data['label'][0]
                for i, lang in enumerate(settings.LANGUAGES):
                    lang_label = form.cleaned_data['label'][i]
                    if not lang_label:
                        lang_label = default_lang_label
                    model_values['html_%s' % lang[0]] += CheckboxElement().render(lang_label,
                                                                                  name,
                                                                                  slugify(default_lang_label),
                                                                                  attrs)
        if self.data.has_key('id'):
            model_values['id'] = self.data['id']

        CheckboxElementModel(**model_values).save()

class SelectElementForm(forms.ModelForm):
    label = TranslationField(label = _('option'))

    class Meta:
        model = SelectElementModel
        fields = ('label',)

class SelectElementFormSet(BaseFormSet):
    """
    Select elements needs to be saved at one time
    """

    def __init__(self, *args, **kwargs):
        super(SelectElementFormSet, self).__init__(*args, **kwargs)

    def save(self):
        qform = QuestionForm(self.data)
        model_values = {}
        name = ''
        if qform.is_valid():
            name = slugify(qform.cleaned_data['question'][0])
            randomize = qform.cleaned_data['randomize']
            for i, lang in enumerate(settings.LANGUAGES):
                lang_question = qform.cleaned_data['question'][i]
                if not lang_question:
                    lang_question = qform.cleaned_data['question'][0]
                model_values['name_%s' % lang[0]] = lang_question
                model_values['html_%s' % lang[0]] = u'<p>{0}'.format(lang_question)

        attrs = {'data-random': 'true'} if randomize else {}
        forms_count = len(self.forms)
        choices = {}
        for i, form in enumerate(self.forms):
            if form.is_valid():
                default_lang_label = form.cleaned_data['label'][0]
                for j, lang in enumerate(settings.LANGUAGES):
                    lang_label = form.cleaned_data['label'][j]
                    if not lang_label:
                        lang_label = default_lang_label
                    if not choices.has_key(lang[0]): # there has to be an empty option
                        choices[lang[0]] =[('','',)]

                    choices[lang[0]].append((slugify(default_lang_label), lang_label))
                    if i+1 == forms_count:
                        model_values['html_%s' % lang[0]] += Select().render(name, '', attrs, choices[lang[0]])
                        model_values['html_%s' % lang[0]] += '</p>'

        if self.data.has_key('id'):
            model_values['id'] = self.data['id']

        SelectElementModel(**model_values).save()

class DrawbuttonForm(forms.ModelForm):
    geometry_type = forms.ChoiceField(choices = (
                                        ('point', _('place')),
                                        ('route', _('route')),
                                        ('area', _('area')),),
                                      label = _('geometry type'))
    label = TranslationField(label = _('button text'))
    color = forms.CharField(max_length = 7,
                            widget = ColorInput,
                            label = _('color'),
                            help_text = _('The color of the feature to be drawn. The color is given as hexadecimal color e.g. #ffffff --> white, #000000 --> black, #ff0000 --> red, #00ff00 --> green, #0000ff --> blue.'))
    popup = forms.ChoiceField(choices = (('',''),),
                              label = _('popup for the place, route or area'),
                              help_text = _('Choose the popup to use for the place, route, or area.'))
    max_amount = forms.IntegerField(min_value = 1,
                                    max_value = 1000,
                                    initial = 10,
                                    label = _('max amount of answers'),
                                    help_text = _('This is the maximum number of allowed places/routes/areas that can be drawn by this drawbutton.'))


    def __init__(self, *args, **kwargs):
        """
        The init function parses through the saved
        html and sets the correct initial
        values for the form.
        """

        super(DrawbuttonForm, self).__init__(*args, **kwargs)
        #set the popup choices
        self.fields['popup'] = forms.ChoiceField(
            choices = Geoform.objects.filter(page_type = 'popup').values_list('slug', 'name'),
            help_text = _('Choose the popup to use for the place, route, or area.'))

        # Set the form fields based on the model object
        if kwargs.has_key('instance'):
            geometry_type = u'point'
            label = []
            color = u'#000000'
            popup = u''
            max_amount = u'10'
            for lang in settings.LANGUAGES:
                lang_html = getattr(kwargs['instance'],'html_%s' % lang[0])
                if lang_html == None:
                    lang_html = getattr(kwargs['instance'],'html_%s' % settings.LANGUAGES[0][0])
                soup = BeautifulSoup(lang_html)
                label.append(soup.button.text.strip())
                if lang[0] == settings.LANGUAGE_CODE:
                    geometry_type = soup.button.get('class', [u'',u'point'])[1]
                    color = soup.button.get('data-color', u'#ff00ee')
                    popup = soup.button.get('data-popup', u'basic')
                    max_amount = soup.button.get('data-max', u'10')

            self.initial['geometry_type'] = geometry_type
            self.initial['label'] = label
            self.initial['color'] = color
            self.initial['popup'] = popup
            self.initial['max_amount'] = max_amount



    def save(self, commit=True):
        model = super(DrawbuttonForm, self).save(commit=False)

        if self.is_valid():
            geometry_type = self.cleaned_data['geometry_type']
            popup = self.cleaned_data['popup']
            color = self.cleaned_data['color']
            max_amount = self.cleaned_data['max_amount']
            default_lang_label = self.cleaned_data['label'][0]
            for i, lang in enumerate(settings.LANGUAGES):
                label = self.cleaned_data['label'][i]
                if not label:
                    label = default_lang_label
                gen_html = Drawbutton().render(default_lang_label, label, geometry_type, color, popup, max_amount)
                setattr(model,
                        'html_%s' % lang[0],
                        gen_html)
                setattr(model,
                        'name_%s' % lang[0],
                        label)

        if commit:
            model.save()

        return model

    class Meta:
        model = DrawbuttonElementModel
        fields = ('geometry_type',
                  'label',
                  'color',
                  'popup',
                  'max_amount')

class ParagraphForm(forms.ModelForm):

    text = TranslationField(field_class = forms.CharField,
                            widget = TranslationWidget(widget_class = forms.Textarea),
                            label = _('text for the paragraph'),
                            help_text = _('This field takes as input any html tags. This enables you to style the text in any way you want. Here is a list of tags that can be used <a href="http://dev.w3.org/html5/spec/single-page.html#usage-summary">html5 tags</a>'))

    def __init__(self, *args, **kwargs):

        super(ParagraphForm, self).__init__(*args, **kwargs)

        # Set the form fields based on the model object
        if kwargs.has_key('instance'):
            initial_values = []
            for lang in settings.LANGUAGES:
                lang_html = getattr(kwargs['instance'],'html_%s' % lang[0])
                if lang_html == None:
                    lang_html = getattr(kwargs['instance'],'html_%s' % settings.LANGUAGES[0][0])
                soup = BeautifulSoup(lang_html)
                if soup.html is not None:
                    soup.html.unwrap()
                if soup.body is not None:
                    soup.body.unwrap()
                soup.p.unwrap() #remove the p tags
                initial_values.append(soup)

            self.initial['text'] = initial_values

    def save(self, commit=True):
        """
        This function saves the elements
        """
        model = super(ParagraphForm, self).save(commit=False)

        if self.is_valid():
            name = slugify(self.cleaned_data['text'][0])

            for i, lang in enumerate(settings.LANGUAGES):
                question = self.cleaned_data['text'][i]
                if not question:
                    question = self.cleaned_data['text'][0]
                gen_html = '<p>%s</p>' % question
                setattr(model, 'html_%s' % lang[0],
                        gen_html)
                setattr(model, 'name_%s' % lang[0],
                        question[:200])

        # Save the fields
        if commit:
            model.save()

        return model



    class Meta:
        model = ParagraphElementModel
        fields = ('text',)

#basic admin forms
class QuestionForm(forms.Form):
    """
    This is used to define the question
    for e.g. radio buttons
    """
    question = TranslationField(label = _('question'))
    randomize = BooleanField(required = False,
                         label = _('randomize the order of the options'))


class LotteryForm(forms.ModelForm):
    class Meta:
        model = LotteryParticipant
        fields = ('email',)
