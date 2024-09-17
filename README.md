Hello hello welcome to SURRF!

![surrfgithub](https://github.com/user-attachments/assets/01941dc8-3e3f-4e6b-b6ab-b17513a482f8)
[fig. 1: picture of a simple surrf] 

I'm a huge fan of open source, so feel free to spin off ! I'm still building it out a ton, so let me know if you have any feedback/cool ideas, or run into any issues, at apumutyala@gmail.com!
uhhh yeah I've never wrote an actual readMe for a personal project but hope you enjoy! :)

## what's SURRF?
I created (and am still working on) SURRF because I'm tired of how we currently track tabs (yes I have 84397 open), navigate the web, and organize and present our knowledge to each other.

with SURRF, you can:
```
Traverse the web to find credible info in a digestible manner
Explore relationships between topics
Save maps of your research rabbit holes
Share organized knowledge graphs with others
```

## Getting Started

First things first, you'll need an API key from Perplexity to run the project. You can get one with the Pro version, or clone my repo and reconfigure the API I made for internal use (app/utils/easyAPI.js) for chatGPT or other models with APIs.

Make sure you have NodeJS and NextJS installed. 

clone the repo, cd into the folder, install dependencies:
```
   git clone https://github.com/MeepMutyala/SURRF.git 
   cd SURRF
   npm install
```

then to run it:
```npm run dev```

Please email me at apumutyala@gmail.com if you have any questions or troubles!

## Next Steps
```
- Images, sources, and link generation with a more intuitive UX. I want to make this way smoother to navigate. I'm imagining a platform where you can send agents off to get knowledge or think something through and get back to you, and you can seamlessly integrate, organize, and store compiled information and findings, while analyzing the strengths of your conclusions with data.

- Real GNN modeling: analysis, node and link prediction, similarity scoring, modeling impacts and strength of relationships, clustering via topic properties (learned representations?), improving suggestions from “surfs” based on what we learn

- saving/encoding generated surfs into an easily sharable format, also if credibility is implemented, encoding with some "SURRF approved" signature.

- Credibility analysis and existing topic connectivity representations

- working with perplexity.ai…?
```
