from django.conf import settings
from django.forms import CharField
from django.forms import MultiValueField
from geoforms.widgets import TranslationWidget
from django.forms.util import ErrorList
from django.core.exceptions import ValidationError
from django.core import validators

class TranslationField(MultiValueField):
    """
    This field handles fields that needs to be translated
    """
    widget = TranslationWidget
    
    def __init__(self, field_class = CharField, *args, **kwargs):
        all_fields = (field_class(),) * len(settings.LANGUAGES)
            
        super(TranslationField, self).__init__(all_fields, *args, **kwargs)

    def clean(self, value):
        """
        Only the default language should be required.
        """
        clean_data = []
        errors = ErrorList()
        if not value or isinstance(value, (list, tuple)):
            if not value or not [v for v in value if v not in validators.EMPTY_VALUES]:
                if self.required:
                    raise ValidationError(self.error_messages['required'])
                else:
                    return self.compress([])
        else:
            raise ValidationError(self.error_messages['invalid'])
        for i, field in enumerate(self.fields):
            try:
                field_value = value[i]
            except IndexError:
                field_value = None
            if i == 0 and self.required and field_value in validators.EMPTY_VALUES:
                raise ValidationError(self.error_messages['required'])
            try:
                clean_data.append(field.clean(field_value))
            except ValidationError as e:
                # Collect all validation errors in a single list, which we'll
                # raise at the end of clean(), rather than raising a single
                # exception for the first error we encounter.
                errors.extend(e.messages)
        if errors:
            raise ValidationError(errors)

        out = self.compress(clean_data)
        self.validate(out)
        self.run_validators(out)
        return out
    
    def compress(self, values_list):
        """
        This function does not do anything.
        """
        return values_list
