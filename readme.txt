|-----------------------------------------|
|             GETTING STARTED             |
|  DocSoup - The static web application.  |
|-----------------------------------------|

### Tech stacks ###
1. Reactjs
2. Nextjs
3. Fluent UI

### Install node_modules ###
yarn install

### How to run on dev environement ###
1. yarn install
2. yarn dev

### How to run on pro environement ###
1. yarn install
2. yarn build
3. yarn start

### How to run unit test ###
1. yarn install
2. yarn test
3. yarn test:coverage
After run test coverage open file coverage/lcov-report/index.html to read the report.

### How to run eslint ###
1. yarn install
2. yarn lint

### Auto format with prettier ###
1. yarn format

### Test environment ###
Url = https://main.da0ls7damv3qc.amplifyapp.com

### Framework, tools, libraries ###
- Reactjs
- React front-end framework: @fluentui/react
- Testing framework: Jest
- Date time library: dayjs
- Form and validation library: formik, yup
- Code linter tools: eslint, prettier

### Install Visual Studio Code extentions ###
- ESlint
- Prettier
- Jest
- EditorConfig for VS Code
- SCSS Formatter
- ES7 React/Redux/GraphQL/React-Native snippets (recommend)
- GitLens — Git supercharged (recommend)

### Project structure ###
|-pages/ (are associated with a route based on their file name. Example `pages/feature-1/first-post.js`)
|-features/
      |-feature-1/
            |-components/ (contains only components of feature-1)
            |-services/ (contains only services of feature-1)
            |-biz/ (contains complex business logics)
|-shared/
      |-components/ (contains only Presentational components (common, customized))
      |-constants/ (contains constants variables)
      |-lib/ (contain extenal libraries)
      |-services/ (base rest services)
|-public/ (contains public assets)
|-styles/ (contains global styles .css, .scss)
|-tests/ (contains unit tests)
- ### Reviewer
- Ask Vy/Chuong to review your changes before merging.
- Release sprint 16+


