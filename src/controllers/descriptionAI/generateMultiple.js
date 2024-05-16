import openai from '../apis/chatgpt.js'
import { subDomainMap } from '../utilities/shop-mapper.js'
import { retrieveProductsforAI , insertDescription, createMetaField} from '../../database/queries.js'
// import {
//   sql,
//   products_tbl,
//   DatabaseProduct,
//   retrieveManyProducts,
//   insertDescriptionAi,
//   updateDescriptionAi,
// } from '@/database/queries'
import { promptGpt4, productDescriptionPrompt, productHtmlPrompt , seoDescriptionPrompt, seoTitlePrompt} from '../utilities/aiHelper.js'
import { ProductText } from '../../database/postgresdb.js';
import Shopify from '../apis/shopify.js';
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Functions
const descriptionPrompt = (language, product_title, vendor, tags, pID) => {
  const gender_tags = tags
    ? tags.split(', ').filter((tag) => tag.toLocaleLowerCase().includes('PIM_Gender_'.toLocaleLowerCase()))
    : []  
  const gender = gender_tags.map((gender) => gender.toLowerCase().split('PIM_Gender_'.toLowerCase())[1]).join(' & ')
  const prompt = productDescriptionPrompt[language].replace('<title>', product_title)

  if (vendor && gender) return prompt.replace('<brand>', vendor).replace('<gender>', gender)
  else if (vendor && !gender) return prompt.replace('<brand>', vendor).replace('Gender = <gender>', '')
  else if (!vendor && gender) return prompt.replace('Brand = <brand>', '').replace('<gender>', gender)
  else return prompt.replace('Brand = <brand>', '').replace('Gender = <gender>', '')
}

const seoDescription = (language, product_title, vendor, tags) => {
  const gender_tags = tags
    ? tags.split(', ').filter((tag) => tag.toLocaleLowerCase().includes('PIM_Gender_'.toLocaleLowerCase()))
    : []  
  const gender = gender_tags.map((gender) => gender.toLowerCase().split('PIM_Gender_'.toLowerCase())[1]).join(' & ')
  const prompt = seoDescriptionPrompt[language].replace('<title>', product_title)

  if (vendor && gender) return prompt.replace('<brand>', vendor).replace('<gender>', gender)
  else if (vendor && !gender) return prompt.replace('<brand>', vendor).replace('Gender = <gender>', '')
  else if (!vendor && gender) return prompt.replace('Brand = <brand>', '').replace('<gender>', gender)
  else return prompt.replace('Brand = <brand>', '').replace('Gender = <gender>', '')
}

const seoTitle = (language, product_title, vendor, tags) => {
  const gender_tags = tags
    ? tags.split(', ').filter((tag) => tag.toLocaleLowerCase().includes('PIM_Gender_'.toLocaleLowerCase()))
    : []  
  const gender = gender_tags.map((gender) => gender.toLowerCase().split('PIM_Gender_'.toLowerCase())[1]).join(' & ')
  const prompt = seoTitlePrompt[language].replace('<title>', product_title)

  if (vendor && gender) return prompt.replace('<brand>', vendor).replace('<gender>', gender)
  else if (vendor && !gender) return prompt.replace('<brand>', vendor).replace('Gender = <gender>', '')
  else if (!vendor && gender) return prompt.replace('Brand = <brand>', '').replace('<gender>', gender)
  else return prompt.replace('Brand = <brand>', '').replace('Gender = <gender>', '')
}

const htmlPrompt = (language, description) => `${productHtmlPrompt[language]}\n\n${description}`

// Controller

const generateProductDescription = async (req,res) => {
  //const { subDomain } = req.body
  //if (!subDomain) return
  //const { name, storeName, language, apiKey } = subDomainMap(subDomain)
  // Retrieve products from database where description is null
  const productsFound = await retrieveProductsforAI();


  console.log('productFound --------------', productsFound.length)
  //console.log('productFound --------------', productsFound.rows)
 if (productsFound.length === 0) return
  res.sendStatus(200);
  // For each product: Initialize items in Monday.com and Merge products with items
  for (const product of productsFound) {
    if (!product.webshop) return
    let a = await ProductText.findOne({where : {product_id  :product.id}});
    if (a){
      console.log('Desc exists');
      return;
    }
    console.log('Generating for product ', product.id);
     const { name, storeName, language, apiKey } = subDomainMap(product.webshop);
     const description = descriptionPrompt(language, product.title, product.vendor ?? '', product.tags ?? '', product.id)
     const seoDesc = seoDescription(language, product.title, product.vendor ?? '', product.tags ?? '')
     const seoTit = seoTitle(language, product.title, product.vendor ?? '', product.tags ?? '')
     //  console.log('seoDesc -----', seoDesc);
     const aiDescription = await promptGpt4(openai, description)
     const aiseoDesc = await promptGpt4(openai, seoDesc)
     const aiTitle = await promptGpt4(openai, seoTit)
     //console.log('aiDescription -----', aiDescription);
     const html = htmlPrompt(language, aiDescription)
      let new_html = await promptGpt4(openai, html)
      // if (!product.body_html) {
      //   new_html = new_html.concat('<p> At TeeShoppen, we specialize in producing basic clothing for the mature person. We have over 750,000 customers through our webshop annually and ship packages every day of the week.</p>');
      // } else {
      //   new_html = new_html.concat(product.body_html,'<p> At TeeShoppen, we specialize in producing basic clothing for the mature person. We have over 750,000 customers through our webshop annually and ship packages every day of the week.</p>');
      // }
      let new_description = await new_html;
      // console.log(new_description);
      
     let newProduct = {
      webshop:product.webshop,
      product_id: product.id,
      title: product.title,
      body_html: product.body_html,
      status: 'Need to review',
      link: `https://admin.shopify.com/store/${name}/products/${product.id}`,
      store: storeName,
      category: 'Products',
      new_description: new_description,
      new_title : aiTitle,
      new_seo_desc : aiseoDesc,
      created_at : new Date(),
      updated_at : new Date(),
      language : language
    }
    await delete newProduct.body_html;
    // console.log('newProduct',newProduct);
    await insertDescription(newProduct);
    const details = {
      id : product.id,
      webshop : product.webshop,
      desc : product.body_html || product.title || 'No description in Shopify.',
      title : product.title
    }
    await createMetaField(details);
  }
  // For each product: Generate description, Update description in shopify while updating status in Monday.com
  //const shopify = new Shopify(name, process.env[apiKey]!)

  // for (const { id, uuid, title, vendor, tags, body_html,new_description } of mergedItems) {
  //   try {
  //     //await updateDescriptionAi(uuid, { status: 'Generating Description' })
  //     const description = descriptionPrompt(language, title, vendor ?? '', tags ?? '')
  //     const aiDescription = await promptGpt4(openai, description)
  //     //await updateDescriptionAi(uuid, { status: 'Converting to HTML' })
  //     const html = htmlPrompt(language, aiDescription)
  //     let new_html = await promptGpt4(openai, html)
  //     if (!body_html) {
  //       new_html = new_html.concat(body_html,'<p>At TeeShoppen, we specialize in producing basic clothing for the mature person. We have over 750,000 customers through our webshop annually and ship packages every day of the week.</p>');
  //     } else {
  //       new_html = new_html.concat('<p>At TeeShoppen, we specialize in producing basic clothing for the mature person. We have over 750,000 customers through our webshop annually and ship packages every day of the week.</p>');
  //     }
  //     new_description = await new_html;
  //     console.log(new_description);
  //     res.sendStatus(200);
      
  //     //await insertDescription()
  //     //await updateDescriptionAi(uuid, { status: 'Updating Product' })
  //     //await shopify.updateProduct(id, { body_html })
  //     //await updateDescriptionAi(uuid, { status: 'Done' })
  //   } catch (error) {
  //     console.log(error.response)
  //     //await updateDescriptionAi(uuid, { status: 'Stuck' })
  //   }
  // }
}

export default generateProductDescription;
