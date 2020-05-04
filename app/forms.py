from flask_wtf import FlaskForm
from wtforms import TextAreaField, FileField
from wtforms.validators import DataRequired
from flask_wtf.file import FileRequired, FileAllowed

nullmsg = "This field is required"

class UploadForm(FlaskForm):
    """ Form for file upload """
    description = TextAreaField(
        label="Description", 
        validators=[
            DataRequired(message=nullmsg),
        ]
    )

    photo = FileField(
        label="Upload Picture", 
        validators=[ 
            FileAllowed(
                ['jpg', 'png', 'jpeg'], 
                message="Image Files Only"
            )
        ]
    )