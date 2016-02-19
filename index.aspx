<%@ language="C#"%>
<%@ Import namespace="System.IO" %>
<%@ Import namespace="System.Reflection" %>
<script runat="server">
public string GetAssemblies() {
        var itemTpl = "<li><div>{0}</div><div>{1}</div></li>";
        var assemblies = "<ul>";
        foreach (Assembly a in AppDomain.CurrentDomain.GetAssemblies())
        {
            var fullName = a.GetName().FullName;
            var location = "";
            try {
                location = a.Location;
            }
            catch (Exception ex) {
                location = ex.Message;
            }
            assemblies += string.Format(itemTpl,fullName, location);
        }
        assemblies += "</ul>";
    return assemblies;
}
</script>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Welcome to Mono XSP!</title>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
</head>
<body>
<% =GetAssemblies() %>
</body>
</html>
