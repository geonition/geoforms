from django.db import models

class Questionnaire(models.Model):
    name = models.CharField(max_length = 100)

class QuestionnaireForms(models.Model):
    questionnaire = models.ForeignKey(Questionnaire)
    geoform = models.ForeignKey(Geoform)
    order = models.IntegerField(default=1)

class Geoform(models.Model):
    questionnaire = models.ManyToManyField(Questionnaire,
                                           through = 'QuestionnaireForms')
    elements = models.ManyToManyField(GeoformElement)


ELEMENT_TYPES = (
    ('text', 'Text'),
    ('email', 'E-mail'),
    ('datetime', 'Date and Time'),
    ('date', 'Date'),
    ('number', 'Number'),
    ('range', 'Range'),
    ('checkbox', 'Checkbox'),
    ('radio', 'Radio button'),
    ('button', 'Button'),
)

class GeoformElement(models.Model):
    type = models.CharField(max_length=30,
                            choices=ELEMENT_TYPES)
    name = models.CharField(default = "",
                            max_length=30)
    value = models.CharField(default = "",
                             max_length=30)
    min = models.IntegerField(default = 0)
    max = models.IntegerField(default = 100)