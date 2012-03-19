from django import forms

class Geoform(forms.Form):
    
    def __init__(self,
                 elements = [],
                 name = '',
                 header = '',
                 text = '',
                 *args,
                 **kwargs):
        
        self.name = name
        self.header = header
        self.text = text
        super(Geoform, self).__init__(*args, **kwargs)
        
        for elem in elements:
            self.fields[elem.ename] = elem.get_field_instance()