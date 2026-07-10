import os

frontend = r'c:\Users\navya\Downloads\exam\FreelanceMarketplace\Frontend'

pages = {
    'index.html':     '/app/',
    'login.html':     '/app/login/',
    'register.html':  '/app/register/',
    'projects.html':  '/app/projects/',
    'bids.html':      '/app/bids/',
    'contracts.html': '/app/contracts/',
    'dashboard.html': '/app/dashboard/',
}

for fname in pages.keys():
    path = os.path.join(frontend, fname)
    with open(path, encoding='utf-8') as f:
        content = f.read()

    # Fix CSS/JS asset refs
    content = content.replace('href="style.css"', 'href="/static/style.css"')
    content = content.replace('src="script.js"',  'src="/static/script.js"')

    # Fix inter-page navigation
    for html_file, app_url in pages.items():
        content = content.replace(f'href="{html_file}"', f'href="{app_url}"')
        content = content.replace(f'href="{html_file}?', f'href="{app_url}?')
        content = content.replace(f"href='{html_file}'", f"href='{app_url}'")
        # fix location.href in JS strings inside HTML
        content = content.replace(f"location.href = '{html_file}'", f"location.href = '{app_url}'")
        content = content.replace(f'location.href = "{html_file}"', f'location.href = "{app_url}"')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed: {fname}')

print('All done!')
