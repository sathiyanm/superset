from flask_appbuilder.security.views import UserDBModelView
from flask_babel import lazy_gettext as _

class MyUserDBModelView(UserDBModelView):
    """
        View that add DB specifics to User view.
        Override to implement your own custom view.
        Then override userdbmodelview property on SecurityManager
    """

    show_fieldsets = [
        (_('User info'),
         {'fields': ['username', 'active', 'roles', 'login_count', 'ref_id']}),
        (_('Personal Info'),
         {'fields': ['first_name', 'last_name', 'email'], 'expanded': True}),
        (_('Audit Info'),
         {'fields': ['last_login', 'fail_login_count', 'created_on',
                     'created_by', 'changed_on', 'changed_by'], 'expanded': False}),
    ]

    user_show_fieldsets = [
        (_('User info'),
         {'fields': ['username', 'active', 'roles', 'login_count', 'ref_id']}),
        (_('Personal Info'),
         {'fields': ['first_name', 'last_name', 'email'], 'expanded': True}),
    ]

    add_columns = ['first_name', 'last_name', 'username', 'active', 'email', 'roles', 'ref_id', 'password', 'conf_password']
    list_columns = ['first_name', 'last_name', 'username', 'email', 'active', 'roles', 'ref_id']
    edit_columns = ['first_name', 'last_name', 'username', 'active', 'email', 'roles', 'ref_id']