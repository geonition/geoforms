from django.db import models
    
class GeoformElement(models.Model):
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

    type = models.CharField(max_length=30,
                            choices=ELEMENT_TYPES)
    name = models.CharField(default = "",
                            max_length=30)
    value = models.CharField(default = "",
                             max_length=30)
    min = models.IntegerField(default = 0)
    max = models.IntegerField(default = 100)
    
    def __unicode__(self):
        return u'%s' % self.name
    
class Geoform(models.Model):
    name = models.CharField(max_length=50)
    elements = models.ManyToManyField(GeoformElement)
    
    def __unicode__(self):
        return u'%s' % self.name

class Questionnaire(models.Model):
    geoforms = models.ManyToManyField(Geoform,
                                      through = 'QuestionnaireForm',
                                      related_name='geoforms')    
    name = models.CharField(max_length = 100)
    #todo slug field for name
    #todo site for model
    
    def __unicode__(self):
        return u'%s' % self.name
    
class QuestionnaireForm(models.Model):
    questionnaire = models.ForeignKey(Questionnaire)
    geoform = models.ForeignKey(Geoform)
    order = models.IntegerField(default=1)
    
    def __unicode__(self):
        return u'questionnaire %s form %s order %s' % (self.questionnaire.name,
                              self.geoform.name,
                              self.order,)





