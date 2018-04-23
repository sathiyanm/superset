from flask_appbuilder.security.sqla.manager import SecurityManager
from .sec_models import MyUser
from .sec_view import MyUserDBModelView

class MySecurityManager(SecurityManager):
    user_model = MyUser
    userdbmodelview = MyUserDBModelView