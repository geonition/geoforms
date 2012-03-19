from django.forms import CharField
from widgets import Button

class ButtonField(CharField):
    """
    This field presents html buttons that
    are mostly used as tools for drawing
    on the map.
    
    The CharField is the chosen as the
    geometries can be described with WKT.
    """
    
    def __init__(self, *args, **kwargs):
        widget_attrs = kwargs.pop('attrs', {}).pop('widget_attrs', {})
        super(ButtonField, self).__init__(widget = Button(attrs = widget_attrs),
                                          *args,
                                          **kwargs)
    
    def clean(self, value):
        #TODO check that it is valid point
        return value
