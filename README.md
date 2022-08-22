<h1 align="center">Contacts App</h1>
<p align="center">
    <img src="https://user-images.githubusercontent.com/68344264/185988061-e148ace3-759e-41f4-a849-6d1ac3f85745.png" width="80%" />
</p>
<h2>Installing</h2>
<p>Preliminary requirements:</p>
<ul>
    <li><a href="https://nodejs.org/">Node.js</a> >= <code>16.14.2</code></li>
    <li><a href="https://www.npmjs.com/">npm</a> >= <code>8.16.0</code></li>
    <li><a href="https://www.docker.com/">Docker</a> >= <code>20.10.14</code></li>
    <li><a href="https://docs.docker.com/compose/">docker-compose</a> >= <code>1.29.2</code></li>
    <li><a href="https://www.gnu.org/software/make/">GNU Make</a> >= <code>3.81</code></li>
</ul>
<p>Installing dependencies:</p>
<pre>npm i</pre>
<h2>Building</h2>
<p>Building backend:</p>
<pre>npm run build</pre>
<p>Building frontend:</p>
<pre>npm run frontend:build</pre>
<h2>Starting</h2>
<p>Starting in production mode:</p>
<pre>npm start</pre>
<p>Starting in development mode:</p>
<pre>npm run dev</pre>
<p>Starting in development mode (with MYSQL Server):</p>
<pre>make run-dev</pre>
<p>Stopping MYSQL Server:</p>
<pre>make stop-dev</pre>
<h2>Environment variables</h2>
<p>List of variables:</p>
<ul>
    <li><code>WEBPACK_DEV</code> - Webpack middleware starting if 1. Default: 0.</li>
    <li><code>PORT</code> - Server port listening. Default: 80.</li>
    <li><code>DATABASE_HOST</code> - Database host. Default: localhost.</li>
    <li><code>DATABASE_USER</code> - Database user. Default: root.</li>
    <li><code>DATABASE_PASSWORD</code> - Database password. Default: qwerty123.</li>
    <li><code>DATABASE_BASE</code> - Database base. Default: contacts-app.</li>
</ul>
<p><a href="https://www.npmjs.com/package/dotenv">Dotenv</a> support is present!</p>
<h2>Code formatting</h2>
<p>Backend code formatting:</p>
<pre>npm run format</pre>
<p>Frontend code formatting:</p>
<pre>npm run frontend:format</pre>
<h2>Deploy</h2>
<p>Building image:</p>
<pre>make build</pre>
<p>Pushing image:</p>
<pre>make push</pre>
<p>Pulling image:</p>
<pre>make pull</pre>
<p>Staring image:</p>
<pre>make run</pre>
<p>Stopping image:</p>
<pre>make stop</pre>
<h2>Stack</h2>
<p>General stack:</p>
<p>
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/prettier-%23F7B93E.svg?&style=for-the-badge&logo=prettier&logoColor=black" />
</p>
<p>Frontend stack:</p>
<p>
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
    <img src="https://img.shields.io/badge/mobx-%23FF9955.svg?&style=for-the-badge&logo=mobx&logoColor=black" />
    <img src="https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white" />
    <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
    <img src="https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black" />
</p>
<p>Backend stack:</p>
<p>
    <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" />
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />   
</p>
<h2>Test accounts</h2>
<p>List of accounts:</p>
<ul>
    <li>
        Account #1
        <ul>
            <li>Login: login</li>
            <li>Password: qwerty123</li>
        </ul>    
    </li>
        <li>
        Account #2
        <ul>
            <li>Login: dev2alert</li>
            <li>Password: 0000</li>
        </ul>    
    </li>
        <li>
        Account #3
        <ul>
            <li>Login: artem</li>
            <li>Password: 123456</li>
        </ul>    
    </li>
</ul>
<p>Contacts App already <a href="http://dev2alert.ru.com/">publicly available</a>!</p>
<h2>License</h2>
<p><a href="./LICENSE">MIT</a></p>
