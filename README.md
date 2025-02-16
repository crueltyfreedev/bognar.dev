---
theme: gaia
class: lead
marp: true
paginate: true
---



<style  style="visibility:hidden">
section {
  background: #faf4eb;
}
</style>


![bg contain](public/bognardev.png)

---

![w:900 h:600](public/Mock1.jpeg)

---

![w:900 h:600](public/desktopMock.jpeg)

---

![](public/mobileMock.jpeg)

---


![w:900 h:600](public/appleMock.jpeg)

---

![w:900 h:600](public/chromeDark.jpeg)

---

![](public/mobileMockDark.jpeg)

---

# Introduction 
---

### Tech Stack:

- Front-end: Next.js, Tailwind CSS, Framer Motion,flubber.js, tailwind-prose
- Back-end: Go (Golang)
- Database: Supabase

---
- [@types/node](https://www.npmjs.com/package/@types/node)
- [@types/react](https://www.npmjs.com/package/@types/react)
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom)
- [@types/sanitize-html](https://www.npmjs.com/package/@types/sanitize-html)
- [@types/showdown](https://www.npmjs.com/package/@types/showdown)
- [autoprefixer](https://www.npmjs.com/package/autoprefixer)
- [eslint](https://www.npmjs.com/package/eslint)
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next)
- [postcss](https://www.npmjs.com/package/postcss)
- [prettier](https://www.npmjs.com/package/prettier)
- [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
- [supabase](https://www.npmjs.com/package/supabase)
- [tailwindcss](https://www.npmjs.com/package/tailwindcss)
- [typescript](https://www.npmjs.com/package/typescript)
---

### Key Features:

- Sleek, modern and accessible (WACAG) design thanks to [RealtimeColours](https://www.realtimecolors.com/?colors=e1eae7-000000-bdd0c9-080c0a-b1c8bf&fonts=Poppins-Poppins)



---

### Infrastructure
![Infrastructure w:900](./public/infra.png)

---
# Backend
---
## Overview
The backend was programmed using Go using the Gin web server, because go is an easy and fast language.

It serves the purpose of a "basic" CRUD-API Layer to the database, it does not serve the html and frontend by itself. 

---
## Core Features Implementation
My backend had the task of being there for all the Project operations and handling authorization of the user, so that only authorized user (The admin) can alter project data.

---

The codebase is structured using a fairly standard Filesystem:

- models: Definition of data and its behavior
- controllers: handling the requests (separated in ```projects.go``` and ```auth.go```)
- database: establishing Database connections and a Supabase storage connection
- and ```main.go``` defining all the routes and the corresponding controllers

---

#### Auth-Controller
```go
func Login(c *gin.Context)
func Register(c *gin.Context)
func Status(c *gin.Context)
func CurrentUser(c *gin.Context)
```
---
#### Project-Controller
```go
func GetProjects(c *gin.Context)
func CreateProject(c *gin.Context)
func GetProjectByID(c *gin.Context)
func UpdateProject(c *gin.Context)
```
---

#### Middleware
```go
func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("jwt middleware")
		err := token.ValidateToken(c)
		if err != nil {
			fmt.Println("Middleware error: ", err)
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}
		fmt.Println("Authorized")
		c.Next()
	}
}
```
---
#### Public Routes
```go
r.GET("/", controllers.Hey)
r.GET("/api/projects", controllers.GetProjects)
r.GET("/api/projects/:id", controllers.GetProjectByID)
r.POST("/login", controllers.Login)
r.POST("/register", controllers.Register)
```
---
#### Private Routes
```go
private := r.Group("/private")
private.Use(middlewares.JwtAuthMiddleware()) //Private routes protected by middleware
{
	private.GET("/user", controllers.CurrentUser)
	private.GET("/status", controllers.Status)
	private.POST("/createProject", controllers.CreateProject)
	private.POST("/updateProject", controllers.UpdateProject)
}
```

---
## Functionality Level
Because the API is not consumable publicly the error handling is being handled internally and a user-friendly error handling is done on the frontend following [this](https://boldist.co/usability/user-friendly-error-messages/) guide

In a real life scenario I would ditch splitting database, in favor of a full-stack solution that Next.js offers.

The database uses [sqlx](https://jmoiron.github.io/sqlx/) for type-safe SQL query to the database.


---
## Issues

Using file storage and database from Supabase requires connecting to the DB and the Storage separately, because I wanted to use SQLx strings for the Database.

Before using the Admin dashboard the admin needs to be crated by another authorized admin

---

## Design Considerations

I chose to use raw SQL to query the data, which helps me being future proof in case I want to migrate the service to a different stack. 

The Backend layer is protected by middleware and uses JWT token instead of cookie storage to authorize users.

---

## Code Quality
My code follows best practices such as using structures to Marshal and unMarshal JSON data from requests with go's ```encoding``` package, I can be confident using the Project structure because go handles filling it for me ad will error when a field is missing.

[Encoding Package Go](https://pkg.go.dev/encoding/json)

  
---
# Database Implementation
---
## Overview
- I opted for supabase as a Database provider which uses postgres. 
- Supabase also handles file storage 
---

## Core Features Implementation
- The database has two Tables and one storage bucket

![DB w:900 h:200](./public/dbTables.png)

---
#### The project JSON structure

![Jsonblob](./public/jsonBlob.png)

---

## Design Considerations
- I used Json as my storage type for the projects as it is Flexible and doesn't need table altering in the future if more fields are required

---

## Innovative Approaches
- Supabase is perfect for local development as you can duplicate the database, which helps keeping integrity at production level  
[How to develop locally with supabase](https://supabase.com/docs/guides/cli/local-development)
---

# Frontend Technical Analysis

---
## Overview
- I used [Next.js](https://nextjs.org/) for several reasons
  - *Server-Side Rendering (SSR)*: Next.js provides out-of-the-box support for server-side rendering, which can improve the performance of your application and make it more SEO-friendly.
  - *Static Site Generation (SSG)*: Next.js also supports static site generation. You can pre-render pages at build time and serve them as static files.
  - *File-system Based Routing*: Next.js uses the file system to create routes. This means that every file inside the pages directory becomes a route automatically.
  - *Development Experience*: Next.js offers features like hot code reloading, automatic routing, and universal rendering, which can enhance the development experience.

---

## Components
- One of my main component is my Navbar which is displayed on all pages
- I tried making all components as composable and reusable as possible so I could use them for as many use cases as possible
 
---

### Example
```tsx
import { twMerge } from "tailwind-merge"
import ScrollMotionDiv from "./scroll-motion-div"

export default function Card({ className, children, motion = false }: { className?: string, children: React.ReactNode, motion?: boolean }) {
    if (motion) {
        return (
            <ScrollMotionDiv className={twMerge(className, 'pt-3 w-full text-card-foreground grid bg-background-50 backdrop-blur-sm shadow-sm shadow-primary-400 rounded-lg ')}>
                {children}
            </ScrollMotionDiv>
        )
    }
    return (
        <div className={twMerge(className, 'pt-3 w-full text-card-foreground grid bg-background-50 backdrop-blur-sm shadow-sm shadow-primary-400 rounded-lg ')}>
            {children}
        </div>
    )
}
```

It is possible to reuse my cards all over the project as I can specify if I want it to have animation/motion can add Tailwind style classes to customize it in any place. I can also pass any kind of components as children so I can render anything inside a card.

[Formidable Blog article](https://formidable.com/blog/2021/react-composition/)

---

```tsx
export default async function ProjectPage({ params }: { params: { id: string } }) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/projects/${params.id}`, { next: { revalidate: 3600 } })
  const project = await (response.json()) as Project;
  
  return (
    <>

      <ProjectEditForm className="" project={project}>
        <ProjectEditHeader>

          {project.data.tags.map((tag, index) => (
            <div key={index} className='flex gap-2'>
              <ProjectEditTag tag={tag}>{tag}</ProjectEditTag>
              <Icons.circleMinus className="w-1 h-1"  />
            </div>
          ))}

          <Icons.circlePlus className='m-3 self-center' />
        </ProjectEditHeader>
        <ProjectEditDate>
          Start Date
        </ProjectEditDate>
        <ProjectEditDate>
          End Date
        </ProjectEditDate>
        <ProjectEditText />
        <ProjectMarkdown></ProjectMarkdown>
        <SubmitButton>Save</SubmitButton>
      </ProjectEditForm>

    </>
  );
}
```


---

## Challenges and Solutions
- My biggest challenge was building the dashboard where I can edit the projects as I needed to render the Markdown in realtime for editing

[How to safely render markdown in react](https://blog.logrocket.com/how-to-safely-render-markdown-using-react-markdown/)

---

# HCI-Investigation

---

## Overview
- HCI investigation is important because it helps to design more intuitive, efficient, and user-friendly interfaces, enhancing user satisfaction and productivity.
- As it is a personal portfolio HCI is of highest importance, users should be able to navigate and interact with my site seamlessly to find all important information

[Importance of HCI](https://www.indeed.com/career-advice/career-development/what-is-human-computer-interaction)




---

## User Study
- I set up a google form to get valuable feedback on user experience and design
This helped me identify Problems with my design which I had not realized before, especially for different ages and backgrounds


---
## Results
---
#### Age of participants

![Age Graph](./public/ageGraph.png)

---

#### Gender of participants

![gender Graph](./public/genderGraph.png)

---

### Positive Feedback

- Users appreciated the clear design, ease of navigation, and overall interactivity.
- The project descriptions and details were found helpful and clear.
- The availability of both light and dark modes was well-received.

---

### Design Feedback

- Positive remarks about the design, color scheme, and icons.
- Some users suggested adding more images for a visually appealing experience.
- Recommendations for minor adjustments, like adding app names after icons.

---
#### Devices used to access the Website

![devices Graph](./public/devicesGraph.png)


---

### Navigation Feedback

- Generally positive feedback on navigation ease.
- Some users suggested improving the navigation for specific elements, like "Visit project" and "Github repository."

---

### Content Suggestions

- Requests for more personal information, background, and biography.
- Suggestions for featuring different types of projects, including animated and interactive ones.

---

### Contact Ease

- Positive feedback on ease of contacting through the portfolio website.
- Some users suggested monitoring the desktop mode and improving the visibility of social media links.

---

### Mode Preferences

- Preferences varied between light and dark modes, with no clear majority.
![Theme Graph](./public/themeGraph.png)

---

##  Implementation of Solutions

---

## Example 

The comment that made me realize: 
Create individual pages for different categories
Younger people it was easy to navigate older people found it hard to navigate and didn't even know how to use the links to different pages

---

### Before
![Link before improvement w:200 h:100](./public/LinkBefore.png)

---
### After
![After implementation w:200 h:100](./public/LinkAfter.png)

---

## 2nd Fix
User found that the navbar was too small

---
![Small header bg contain](./public/smallHeader.png)

---

![Big header bg contain](./public/biggerHeader.png)


---

## Design Considerations
- Designing the website it was important for me to keep a coherent look and feel to it, thats why I reached to Tailwind CSS and a modern colour pallet


---
- The Colours are easily adjustable via the ```globals.css``` file, it makes it extendable for further adjustments if I don't feel like my Website needs a fresh colour scheme
---

## Frontend DevOps and Hosting
- I decided to use Vercel for hosting my frontend as it is the proprietary hosting service for Next.js and is highly designed about continuos integration. It produces a preview for each commit and allows me to look at older versions of my website to see if I actually improved my site.
- Vercel uses Serverless infrastructure which means it can scale in case a lot of traffic is generated, for now I will not reach the limits of the generous free tier
- Easy setup of environment variables through their dashboard
---
## Backend DevOps and Hosting
- My backend is hosted on Fly.io, it was an easy choice, as it integrates well with Golang.
- It has great Logging which helped me debugging even in Production
- Easy setup of environment variables through their dashboard
- I set up a Github action which allows me to have automatic checks and deployment on commit to have a seamless productivity
---
## Database Deployment
- Using the Supabase hosting was simple to set up
- Great for local development, because it is possible to clone the database to local development with docker including all feature lie the storage which is great because I can test on real data without damaging production data  
---
## Script for Local Development
```bash

rem
echo Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

rem 
timeout /t 10

rem 
echo Starting Supabase...
cd C:\Users\Niklas\Documents\Uni23_24\WEB\bognar.dev-portfolio\app
start npx supabase start

rem
timeout /t 10

rem
echo Starting Go application...
cd C:\Users\Niklas\Documents\Uni23_24\WEB\bognar.dev-backend\
start cmd /k "go run main.go"

rem 
echo Starting Next.js development server...
start cmd /k "cd C:\Users\Niklas\Documents\Uni23_24\WEB\bognar.dev-portfolio && pnpm run dev"

```  
---
# Optimization Investigation

---

## Introduction
- Performance optimization is crucial for providing users with a seamless and efficient experience, impacting factors such as page load times and user engagement.

---

## Current State
- The project initially faced challenges related to layout shifts and unnecessary renders
- Due to Next.js being a highly optimized framework performance was good out of the box, the defaults enforced by it help to get performance right first time.
- Server side rendering is generating static pages at build time which is faster then building them at run time to send them especially when the server is performing a cold start, which is important if there is low traffic
---

## Lighthouse Analysis
- Conducted a detailed analysis of Lighthouse scores for the project.
- Metrics breakdown:
  - **Performance:** Measures aspects like first contentful paint and speed index.
  - **Accessibility:** Examines the project's accessibility for all users.
  - **Best Practices:** Evaluates adherence to web development best practices.
[Importance of Lighthouse scores](https://mcdsystems.co.uk/lighthouse-scores-what-are-they-and-why-are-they-important/)
---



![bg contain](./public/LighthouseScore.png)

---

## Identified Issues
- Specific issues identified through Lighthouse analysis include:
  - Layout shifts impacting user experience.
  - Opportunities for improving resource loading efficiency.
  - Accessibility enhancements needed for diverse user interactions.

---



