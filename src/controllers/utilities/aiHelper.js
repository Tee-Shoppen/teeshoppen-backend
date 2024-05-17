// Helpers
const productDescriptionPrompt = {
  Danish: `Du er tekstforfatter hos TeeShoppen og skal skrive en tekst på omkring 400 til 500 ord om et produkt. Du har følgende oplysninger, du skal inkludere i din tekst:
  Sprog = dansk
  Produkttitel = <title>
  Mærke = <brand>
  Køn = <gender>`,
  Czech: `Jste copywriter v TeeShoppen a potřebujete o produktu napsat text o délce přibližně 400 až 500 slov. Máte následující informace, které musíte do svého textu zahrnout:
  Jazyk = čeština
  Název produktu = <title>
  Značka = <brand>
  Pohlaví = <gender>`,
  German: `Sie sind Texter bei TeeShoppen und müssen einen Text von etwa 400 bis 500 Wörtern zu einem Produkt verfassen. Sie haben die folgenden Informationen, die Sie in Ihren Text aufnehmen müssen:
  Sprache = Deutsch
  Produkttitel = <title>
  Marke = <brand>
  Geschlecht = <gender>`,
  Finnish: `Olet tekstinkirjoittaja TeeShoppen ja sinun on kirjoitettava tuotteesta noin 400–500 sanaa pitkä teksti. Sinulla on seuraavat tiedot, jotka sinun on sisällytettävä tekstiisi:
  Kieli = suomi
  Tuotteen nimi = <title>
  Merkki = <brand>
  Sukupuoli = <gender>`,
  Dutch: `Je bent copywriter bij Teeshoppen en moet een tekst van ongeveer 400 tot 500 woorden schrijven over een product. U heeft de volgende gegevens nodig die u in uw tekst moet opnemen:
  Taal = Nederlands
  Producttitel = <title>
  Merk = <brand>
  Geslacht = <gender>`,
  Norwegian: `Du er tekstforfatter hos TeeShoppen og trenger å skrive en tekst på rundt 400 til 500 ord om et produkt. Du har følgende informasjon du må inkludere i teksten din:
  Språk = norsk
  Produkttittel = <title>
  Merke = <brand>
  Kjønn = <gender>`,
  Polish: `Jesteś copywriterem w TeeShoppen i musisz napisać tekst o produkcie zawierający od 400 do 500 słów. Masz następujące informacje, które musisz uwzględnić w swoim tekście:
  Język = polski
  Tytuł produktu = <title>
  Marka = <brand>
  Płeć = <gender>`,
  Swedish: `Du är copywriter på TeeShoppen och behöver skriva en text på cirka 400 till 500 ord om en produkt. Du har följande information som du behöver inkludera i din text:
  Språk = svenska
  Produkttitel = <title>
  Märke = <brand>
  Kön = <gender>`,
  'England English': `You are a copywriter at TeeShoppen and need to write a text of around 400 to 500 words about a product. You have the following information you need to include in your text:
  Language = England english
  Product title = <title>
  Brand = <brand>
  Gender = <gender>`,
  'American English': `You are a copywriter at TeeShoppen and need to write a text of around 400 to 500 words about a product. You have the following information you need to include in your text:
  Language = American english
  Product title = <title>
  Brand = <brand>
  Gender = <gender>`,
  English: `You are a copywriter at TeeShoppen and need to write a text of around 400 to 500 words about a product. You have the following information you need to include in your text:
  Language = English
  Product title = <title>
  Brand = <brand>
  Gender = <gender>`,
  }

  const seoDescriptionPrompt = {
    Danish: `Skriv en unik SEO-metabeskrivelse med en maksimal længde på 320 tegn. Mere end 320 tegn accepteres ikke, og sæt venligst ikke citater på beskrivelsen. Det skal vise troværdighed og give folk lyst til at købe produktet, når de ser overskriften. Vi har altid ✓ Hurtig levering ✓ 101 dages ombytning ✓ Prisgaranti ✓ Sikker shopping.
    Du har følgende oplysninger, du skal inkludere i din tekst:
    Sprog = dansk
    Produkttitel = <title>
    Mærke = <brand>
    Køn = <gender>`,
    Czech: `Napište jedinečný SEO Meta popis s maximální délkou pouze 320 znaků. Více než 320 znaků nebude akceptováno a prosím, neuvádějte do popisu citace. Musí ukázat důvěryhodnost a přimět lidi, aby si chtěli produkt koupit, když vidí titulek. Vždy máme ✓ Rychlé dodání ✓ 101denní výměna ✓ Garance ceny ✓ Bezpečné nakupování.
    Máte následující informace, které musíte do svého textu zahrnout:
    Jazyk = čeština
    Název produktu = <title>
    Značka = <brand>
    Pohlaví = <gender>`,
    German: `Schreiben Sie eine eindeutige SEO-Meta-Beschreibung mit einer maximalen Länge von 320 Zeichen. Mehr als 320 Zeichen werden nicht akzeptiert und bitte verwenden Sie keine Anführungszeichen in der Beschreibung. Es muss Glaubwürdigkeit zeigen und Menschen dazu bringen, das Produkt zu kaufen, wenn sie die Schlagzeile sehen. Wir bieten immer ✓ schnelle Lieferung ✓ 101-Tage-Umtausch ✓ Preisgarantie ✓ Sicheres Einkaufen.
    Sie haben die folgenden Informationen, die Sie in Ihren Text aufnehmen müssen:
    Sprache = Deutsch
    Produkttitel = <title>
    Marke = <brand>
    Geschlecht = <gender>`,
    Finnish: `Kirjoita ainutlaatuinen SEO Meta -kuvaus, jonka enimmäispituus on vain 320 merkkiä. Yli 320 merkkiä ei hyväksytä, äläkä laita kuvaukseen lainauksia. Sen on osoitettava uskottavuutta ja saatava ihmiset haluamaan ostaa tuotetta, kun he näkevät otsikon. Meillä on aina ✓ Nopea toimitus ✓ 101 päivän vaihto ✓ Hintatakuu ✓ Turvallinen ostos.
    Sinulla on seuraavat tiedot, jotka sinun on sisällytettävä tekstiisi:
    Kieli = suomi
    Tuotteen nimi = <title>
    Merkki = <brand>
    Sukupuoli = <gender>`,
    Dutch: `Schrijf een unieke SEO-metabeschrijving met een maximale lengte van slechts 320 tekens. Meer dan 320 tekens worden niet geaccepteerd en plaats geen citaten in de beschrijving. Het moet geloofwaardigheid uitstralen en ervoor zorgen dat mensen het product willen kopen als ze de kop zien. Wij hebben altijd ✓ Snelle levering ✓ 101 dagen bedenktijd ✓ Prijsgarantie ✓ Veilig winkelen.
    U heeft de volgende gegevens nodig die u in uw tekst moet opnemen:
    Taal = Nederlands
    Producttitel = <title>
    Merk = <brand>
    Geslacht = <gender>`,
    Norwegian: `Skriv en unik SEO-metabeskrivelse med en maksimal lengde på bare 320 tegn. Mer enn 320 tegn vil ikke bli akseptert, og vennligst ikke skriv sitater på beskrivelsen. Det må vise troverdighet og gi folk lyst til å kjøpe produktet når de ser overskriften. Vi har alltid ✓ Rask levering ✓ 101 dagers bytte ✓ Prisgaranti ✓ Trygg handel.
    Du har følgende informasjon du må inkludere i teksten din:
    Språk = norsk
    Produkttittel = <title>
    Merke = <brand>
    Kjønn = <gender>`,
    Polish: `Napisz unikalny opis SEO Meta o maksymalnej długości 320 znaków. Więcej niż 320 znaków nie będzie akceptowanych i proszę nie umieszczać cudzysłowów w opisie. Musi wykazywać wiarygodność i sprawiać, że ludzie, gdy zobaczą nagłówek, będą chcieli kupić produkt. Zawsze mamy ✓ szybką dostawę ✓ 101-dniową wymianę ✓ gwarancję ceny ✓ bezpieczne zakupy. 
    Masz następujące informacje, które musisz uwzględnić w swoim tekście:
    Język = polski
    Tytuł produktu = <title>
    Marka = <brand>
    Płeć = <gender>`,
    Swedish: `Skriv en unik SEO-metabeskrivning med en maximal längd på endast 320 tecken. Mer än 320 tecken accepteras inte och vänligen skriv inte citat på beskrivningen. Det måste visa trovärdighet och få folk att vilja köpa produkten när de ser rubriken. Vi har alltid ✓ Snabb leverans ✓ 101 dagars byte ✓ Prisgaranti ✓ Säker shopping.
    Du har följande information som du behöver inkludera i din text:
    Språk = svenska
    Produkttitel = <title>
    Märke = <brand>
    Kön = <gender>`,
    'England English': `Write a unique SEO Meta description with a maximum length of 320 characters only.More than 320 characters will not be accepted and please don't put quotations on the description. It must  show credibility and make people want to buy the product when they see the headline.We always have ✓ Fast delivery ✓ 101-day exchange ✓ Price guarantee ✓ Secure shopping.
    You have the following information you need to include in your text:
    Language = England english
    Product title = <title>
    Brand = <brand>
    Gender = <gender>`,
    'American English': `Write a unique SEO Meta description with a maximum length of 320 characters only.More than 320 characters will not be accepted and please don't put quotations on the description. It must  show credibility and make people want to buy the product when they see the headline.We always have ✓ Fast delivery ✓ 101-day exchange ✓ Price guarantee ✓ Secure shopping.
    You have the following information you need to include in your text:
    Language = American english
    Product title = <title>
    Brand = <brand>
    Gender = <gender>`,
    English: `Write a unique SEO Meta description with a maximum length of 320 characters only.More than 320 characters will not be accepted and please don't put quotations on the description. It must  show credibility and make people want to buy the product when they see the headline.We always have ✓ Fast delivery ✓ 101-day exchange ✓ Price guarantee ✓ Secure shopping.
    You have the following information you need to include in your text:
    Language = English
    Product title = <title>
    Brand = <brand>
    Gender = <gender>`,
  }

  const seoTitlePrompt = {
    Danish: `Skriv en unik SEO-sidetitel med en maksimal længde på kun 70 tegn. Mere end 70 tegn accepteres ikke, dette er vigtigt.
    Du har følgende oplysninger, du skal inkludere i din tekst:
    Sprog = dansk
    Produkttitel = <title>
    Mærke = <brand>`,
    Czech: `Napište jedinečný název SEO stránky s maximální délkou pouze 70 znaků. Více než 70 znaků nebude akceptováno, to je důležité.
    Máte následující informace, které musíte do svého textu zahrnout:
    Jazyk = čeština
    Název produktu = <title>
    Značka = <brand>`,
    German: `Schreiben Sie einen eindeutigen SEO-Seitentitel mit einer maximalen Länge von 70 Zeichen. Mehr als 70 Zeichen werden nicht akzeptiert, das ist wichtig.
    Sie haben die folgenden Informationen, die Sie in Ihren Text aufnehmen müssen:
    Sprache = Deutsch
    Produkttitel = <title>
    Marke = <brand>`,
    Finnish: `Kirjoita ainutlaatuinen SEO-sivun otsikko, jonka enimmäispituus on vain 70 merkkiä. Yli 70 merkkiä ei hyväksytä, tämä on tärkeää.
    Sinulla on seuraavat tiedot, jotka sinun on sisällytettävä tekstiisi:
    Kieli = suomi
    Tuotteen nimi = <title>
    Merkki = <brand>`,
    Dutch: `Schrijf een unieke SEO-paginatitel met een maximale lengte van slechts 70 tekens. Meer dan 70 tekens worden niet geaccepteerd, dit is belangrijk.
    U heeft de volgende gegevens nodig die u in uw tekst moet opnemen:
    Taal = Nederlands
    Producttitel = <title>
    Merk = <brand>`,
    Norwegian: `Skriv en unik SEO-sidetittel med en maksimal lengde på bare 70 tegn. Mer enn 70 tegn vil ikke bli akseptert, dette er viktig.
    Du har følgende informasjon du må inkludere i teksten din:
    Språk = norsk
    Produkttittel = <title>
    Merke = <brand>`,
    Polish: `Napisz unikalny tytuł strony SEO o maksymalnej długości tylko 70 znaków. Więcej niż 70 znaków nie będzie akceptowanych, jest to ważne.
    Masz następujące informacje, które musisz uwzględnić w swoim tekście:
    Język = polski
    Tytuł produktu = <title>
    Marka = <brand>`,
    Swedish: `Skriv en unik SEO-sidatitel med en maximal längd på endast 70 tecken. Mer än 70 tecken accepteras inte, detta är viktigt.
    Du har följande information som du behöver inkludera i din text:
    Språk = svenska
    Produkttitel = <title>
    Märke = <brand>`,
    'England English': `Write a unique SEO page title with a maximum length of 70 characters only.More than 70 characters will not be accepted, this is important.
    You have the following information you need to include in your text:
    Language = England english
    Product title = <title>
    Brand = <brand>`,
    'American English': `Write a unique SEO page title with a maximum length of 70 characters only.More than 70 characters will not be accepted, this is important.
    You have the following information you need to include in your text:
    Language = American english
    Product title = <title>
    Brand = <brand>`,
    English: `Write a unique SEO page title with a maximum length of 70 characters only.More than 70 characters will not be accepted, this is important. 
    You have the following information you need to include in your text:
    Language = English
    Product title = <title>
    Brand = <brand>`,
  }
  
  const productHtmlPrompt = {
    Danish: `Du er html-udvikler og skal konvertere en produktbeskrivelse til html.
    1) Bare svar med HTML, da dit svar vil blive brugt direkte på et websted.
    2) Brug samme sprog (dansk)`,
    Czech: `Jste html vývojář a potřebujete převést popis produktu do html.
    1) Stačí odpovědět pomocí kódu HTML, protože vaše odpověď bude použita přímo na webu.
    2) Použijte stejný poskytnutý jazyk (čeština)`,
    German: `Sie sind HTML-Entwickler und müssen eine Produktbeschreibung in HTML konvertieren.
    1) Antworten Sie einfach im HTML-Code, da Ihre Antwort direkt auf einer Website verwendet wird.
    2) Verwenden Sie die gleiche bereitgestellte Sprache (Deutsch)`,
    Finnish: `Olet html-kehittäjä ja sinun on muutettava tuotekuvaus html:ksi.
    1) Vastaa vain HTML-koodilla, koska vastaustasi käytetään suoraan sivustolla.
    2) Käytä samaa kieltä (suomi)`,
    Dutch: `U bent een html-ontwikkelaar en moet een productbeschrijving naar html converteren.
    1) Antwoord gewoon met HTML, aangezien uw antwoord direct in een website wordt gebruikt.
    2) Gebruik dezelfde aangeboden taal (Nederlands)`,
    Norwegian: `Du er en html-utvikler og trenger å konvertere en produktbeskrivelse til html.
    1) Bare svar med HTML-en siden svaret ditt vil bli brukt direkte på et nettsted.
    2) Bruk samme språk (norsk)`,
    Polish: `Jesteś programistą HTML i chcesz przekonwertować opis produktu na HTML.
    1) Po prostu odpowiedz, używając kodu HTML, ponieważ Twoja odpowiedź zostanie użyta bezpośrednio w witrynie internetowej. Musi zaczynać się od <html> i kończyć na </html>.
    2) Użyj tego samego języka, jaki jest podany (polski)`,
    Swedish: `Du är html-utvecklare och behöver konvertera en produktbeskrivning till html.
    1) Svara bara med HTML-koden eftersom ditt svar kommer att användas direkt på en webbplats.
    2) Använd samma språk (svenska)`,
    'England English': `You are a html developer and need to convert a product description in html in England english.
    1) Just answer with the HTML as your response will be used directly in a website. Must start with <html> and end with </html>. 
    2) Use the same language provided (England English)`,
    'American English': `You are a html developer and need to convert a product description in html in American english.
    1) Just answer with the HTML as your response will be used directly in a website.
    2) Use the same language provided (American English)`,
    English: `You are a html developer and need to convert a product description in html.
    1) Just answer with the HTML as your response will be used directly in a website.
    2) Use the same language provided (English)`,
  }
  
  const collectionDescriptionPrompt = {
    Danish: `Du er tekstforfatter hos TeeShoppen og skal skrive en tekst på omkring 500 til 600 ord om et samlingsprodukt. Produkterne i kollektionerne er disse:
    Sprog = dansk
    
    <products>
    
    Samlingens titel er <collection_title>`,
    Czech: `Jste copywriter v TeeShoppen a potřebujete napsat text o rozsahu přibližně 500 až 600 slov o produktu kolekce. Produkty v kolekcích jsou tyto:
    Jazyk = čeština
  
    <products>
    
    Název kolekce je <název_sbírky>`,
    German: `Sie sind Texter bei TeeShoppen und müssen einen Text von etwa 500 bis 600 Wörtern über ein Kollektionsprodukt schreiben. Die Produkte in den Kollektionen sind diese:
    Sprache = Deutsch
      
    <products>
    
    Der Titel der Sammlung lautet <collection_title>`,
    Finnish: `Olet tekstinkirjoittaja TeeShoppenissa ja sinun on kirjoitettava noin 500–600 sanan teksti kokoelmatuotteesta. Kokoelmien sisällä olevat tuotteet ovat seuraavat:
    Kieli = suomi
      
    <products>
    
    Kokoelman nimi on <collection_title>`,
    Dutch: `Je bent copywriter bij Teeshoppen en moet een tekst van ongeveer 500 tot 600 woorden schrijven over een collectieproduct. De producten in de collecties zijn deze:
    Taal = Nederlands
  
    <products>
    
    De titel van de collectie is <collection_title>`,
    Norwegian: `Du er tekstforfatter hos TeeShoppen og trenger å skrive en tekst på rundt 500 til 600 ord om et samlingsprodukt. Produktene i kolleksjonene er disse:
    Språk = norsk
  
    <products>
    
    Tittelen på samlingen er <collection_title>`,
    Polish: `Jesteś copywriterem w TeeShoppen i musisz napisać tekst o długości około 500 do 600 słów na temat produktu z kolekcji. Produkty znajdujące się w kolekcjach to:
    Język = polski
  
    <products>
    
    Tytuł kolekcji to <collection_title>`,
    Swedish: `Du är copywriter på TeeShoppen och behöver skriva en text på cirka 500 till 600 ord om en samlingsprodukt. Produkterna i kollektionerna är dessa:
    Språk = svenska
      
    <products>
    
    Titeln på samlingen är <collection_title>`,
    'England English': `You are a copywriter at TeeShoppen and need to write a text of around 500 to 600 words about a collection product in England English. The products inside the collections are these:
    Language = England english
  
    <products>
    
    The title of the collection is <collection_title>`,
    'American English': `You are a copywriter at TeeShoppen and need to write a text of around 500 to 600 words about a collection product in American English. The products inside the collections are these:
    Language = American english
    
    <products>
    
    The title of the collection is <collection_title>`,
    English: `You are a copywriter at TeeShoppen and need to write a text of around 500 to 600 words about a collection product. The products inside the collections are these:
    Language = English
  
    <products>
    
    The title of the collection is <collection_title>`,
  }
  
  const collectionHtmlPrompt = {
    Danish: `Du er html-udvikler og skal konvertere en beskrivelse af samling af produkter til html.
    1) Bare svar med HTML, da dit svar vil blive brugt direkte på et websted.`,
    Czech: `Jste html vývojář a potřebujete převést popis kolekce produktů do html.
    1) Stačí odpovědět pomocí kódu HTML, protože vaše odpověď bude použita přímo na webu.`,
    German: `Sie sind ein HTML-Entwickler und müssen eine Beschreibung einer Produktsammlung in HTML konvertieren.
    1) Antworten Sie einfach im HTML-Code, da Ihre Antwort direkt auf einer Website verwendet wird.`,
    Finnish: `Olet html-kehittäjä ja sinun on muutettava tuotekokoelman kuvaus html-muodossa.
    1) Vastaa vain HTML-koodilla, koska vastaustasi käytetään suoraan sivustolla.`,
    Dutch: `U bent een html-ontwikkelaar en moet een beschrijving van een verzameling producten in html converteren.
    1) Antwoord gewoon met HTML, aangezien uw antwoord direct in een website wordt gebruikt.`,
    Norwegian: `Du er en html-utvikler og trenger å konvertere en beskrivelse av samling av produkter til html.
    1) Bare svar med HTML-en siden svaret ditt vil bli brukt direkte på et nettsted.`,
    Polish: `Jesteś programistą HTML i chcesz przekonwertować opis kolekcji produktów do formatu HTML.
    1) Po prostu odpowiedz, używając kodu HTML, ponieważ Twoja odpowiedź zostanie użyta bezpośrednio w witrynie.`,
    Swedish: `Du är en html-utvecklare och behöver konvertera en beskrivning av samling av produkter till html.
    1) Svara bara med HTML eftersom ditt svar kommer att användas direkt på en webbplats.`,
    'England English': `You are a html developer and need to convert a description of collection of products in html in England english.
    1) Just answer with the HTML as your response will be used directly in a website.`,
    'American English': `You are a html developer and need to convert a description of collection of products in html in American english.
    1) Just answer with the HTML as your response will be used directly in a website.`,
    English: `You are a html developer and need to convert a description of collection of products in html.
    1) Just answer with the HTML as your response will be used directly in a website.`,
  }
  
  const promptGpt4 = async (openai, content) => {
    const data = await openai.chat.completions.create({ model: 'gpt-4', messages: [{ role: 'user', content }] })
    const { choices: text } = data
    // if (!text[0]) throw Error('GPT not generated')
    return text[0].message.content
  }

  export{
    productDescriptionPrompt,
    collectionDescriptionPrompt,
    productHtmlPrompt,
    collectionHtmlPrompt,
    seoDescriptionPrompt,
    seoTitlePrompt,
    promptGpt4,
  }