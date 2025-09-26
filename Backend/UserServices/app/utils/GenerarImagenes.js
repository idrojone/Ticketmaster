const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Tus géneros (sin cambios)
const generos = [
    // { "slug": "rock-a3f7k2", "nombre": "Rock", "img": "rock.jpg", "descripcion": "Música rock clásica y moderna con guitarras eléctricas y ritmos potentes", "id_genero": "GEN001" },
    // { "slug": "pop-m8n5w1", "nombre": "Pop", "img": "pop.jpg", "descripcion": "Música popular contemporánea con melodías pegadizas y comerciales", "id_genero": "GEN002" },
    // { "slug": "hip-hop-x7z9q4", "nombre": "Hip Hop", "img": "hiphop.jpg", "descripcion": "Música urbana con rap, beats y cultura hip hop", "id_genero": "GEN003" },
    // { "slug": "electronic-p2r6t8", "nombre": "Electronic", "img": "electronic.jpg", "descripcion": "Música electrónica, EDM y sonidos sintetizados", "id_genero": "GEN004" },
    // { "slug": "reggaeton-k5h3n9", "nombre": "Reggaeton", "img": "reggaeton.jpg", "descripcion": "Música urbana latina con ritmos caribeños", "id_genero": "GEN005" },
    // { "slug": "jazz-d1f4v7", "nombre": "Jazz", "img": "jazz.jpg", "descripcion": "Jazz clásico y contemporáneo con improvisación", "id_genero": "GEN006" },
    // { "slug": "blues-s8l2b6", "nombre": "Blues", "img": "blues.jpg", "descripcion": "Blues tradicional con guitarra y armónica", "id_genero": "GEN007" },
    // { "slug": "country-g3y5u0", "nombre": "Country", "img": "country.jpg", "descripcion": "Música country americana y folk", "id_genero": "GEN008" },
    // { "slug": "classical-c9i1e4", "nombre": "Classical", "img": "classical.jpg", "descripcion": "Música clásica, orquestal y de cámara", "id_genero": "GEN009" },
    // { "slug": "reggae-j6o8a2", "nombre": "Reggae", "img": "reggae.jpg", "descripcion": "Reggae jamaicano con ritmos relajados", "id_genero": "GEN010" },
    { "slug": "alternative-w4t7r5", "nombre": "Alternative", "img": "alternative.jpg", "descripcion": "Rock alternativo e indie underground", "id_genero": "GEN011" },
    { "slug": "metal-z1m9x3", "nombre": "Metal", "img": "metal.jpg", "descripcion": "Heavy metal y subgéneros extremos", "id_genero": "GEN012" },
    { "slug": "punk-n5q2l8", "nombre": "Punk", "img": "punk.jpg", "descripcion": "Punk rock rebelde y hardcore", "id_genero": "GEN013" },
    { "slug": "r-b-h7k4p1", "nombre": "R&B", "img": "rnb.jpg", "descripcion": "Rhythm and Blues contemporáneo", "id_genero": "GEN014" },
    { "slug": "soul-f3v6c9", "nombre": "Soul", "img": "soul.jpg", "descripcion": "Soul clásico y funk con groove", "id_genero": "GEN015" },
    { "slug": "folk-b8s1d4", "nombre": "Folk", "img": "folk.jpg", "descripcion": "Música folk tradicional y acústica", "id_genero": "GEN016" },
    { "slug": "latin-y2u5i7", "nombre": "Latin", "img": "latin.jpg", "descripcion": "Música latina tradicional y moderna", "id_genero": "GEN017" },
    { "slug": "flamenco-q6w3e0", "nombre": "Flamenco", "img": "flamenco.jpg", "descripcion": "Flamenco español tradicional con guitarra", "id_genero": "GEN018" },
    { "slug": "indie-l9r4t6", "nombre": "Indie", "img": "indie.jpg", "descripcion": "Música independiente y experimental", "id_genero": "GEN019" },
    { "slug": "trap-a5g8j2", "nombre": "Trap", "img": "trap.jpg", "descripcion": "Trap urbano con beats pesados", "id_genero": "GEN020" }
];

// ✅ POLLINATIONS AI - SIN TOKEN, FUNCIONAL
const API_URL = "https://image.pollinations.ai/prompt";
const API_TOKEN = null; // No necesario para Pollinations
const imagesDir = 'C:\\Users\\idrojone\\dev\\Ticketmaster\\ticketmain\\src\\assets\\img';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

function generatePrompt(genero) {
    const basePrompts = {
        // 'Rock': 'epic rock concert electric guitar amplifiers stage lights smoke crowd dramatic cinematic realistic',
        // 'Pop': 'vibrant pop stage disco balls colorful lights microphone energetic commercial pop music',
        // 'Hip Hop': 'urban hip hop scene graffiti turntables rapper microphone street style cinematic realistic',
        // 'Electronic': 'EDM festival neon lights DJ booth lasers crowd dancing cyberpunk electronic music',
        // 'Reggaeton': 'tropical reggaeton party palm trees beach latin dancers vibrant colors summer music',
        // 'Jazz': 'moody jazz club saxophone player warm lighting vintage smoke intimate atmosphere',
        // 'Blues': 'blues bar night acoustic guitar harmonica dim light soulful melancholic music',
        // 'Country': 'american country field acoustic guitar cowboy hat sunset rustic folk music',
        // 'Classical': 'grand concert hall orchestra violin elegant chandelier refined classical music',
        // 'Reggae': 'jamaican beach rasta colors palm trees relaxed reggae music peaceful atmosphere',
        // 'Alternative': 'indie rock band small venue moody lighting artistic underground alternative music',
        'Metal': 'heavy metal concert dark stage fire electric guitars aggressive intense music',
        'Punk': 'punk rock show leather jackets mohawks raw energy gritty rebellious music',
        'R&B': 'smooth R&B performance elegant stage soulful singer modern sophisticated music',
        'Soul': 'classic soul music vintage microphone warm tones funk groove retro music',
        'Folk': 'acoustic folk singer forest wooden guitar natural light serene authentic music',
        'Latin': 'latin festival colorful costumes traditional instruments joyful cultural music',
        'Flamenco': 'spanish flamenco dancer red dress guitar passionate dramatic lighting music',
        'Indie': 'indie artist loft studio experimental creative moody artistic music',
        'Trap': 'modern trap studio urban dark lighting gold chains beats contemporary music'
    };

    return basePrompts[genero.nombre] || `${genero.nombre} music scene realistic`;
}

async function generateImage(prompt) {
    try {
        console.log('Prompt:', prompt);

        // Pollinations usa GET con query parameters - MÁXIMA RESOLUCIÓN
        const encodedPrompt = encodeURIComponent(prompt);
        const url = `${API_URL}/${encodedPrompt}?width=1920&height=1080&seed=-1&model=flux&enhance=true&nologo=true&quality=100`;

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 60000  // 1 minuto para imágenes de alta resolución
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error('❌ Error en API:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
        throw error;
    }
}

async function saveImage(imageBuffer, filename) {
    const filePath = path.join(imagesDir, filename);
    fs.writeFileSync(filePath, imageBuffer);
    console.log(`✅ Guardado: ${filename}`);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAllImages() {
    console.log('🎵 Generando imágenes con Pollinations.ai (gratuito, sin token)...');

    let success = 0, fail = 0;

    for (const g of generos) {
        try {
            console.log(`\n🎨 ${g.nombre}`);
            const prompt = generatePrompt(g);
            const img = await generateImage(prompt);
            await saveImage(img, g.img);
            success++;
            await delay(3000); // Más tiempo para imágenes de alta resolución
        } catch (err) {
            fail++;
            console.error(`❌ Falló: ${g.nombre}`);
        }
    }

    console.log(`\n✅ ${success} imágenes generadas`);
    console.log(`❌ ${fail} fallidas`);
}

if (require.main === module) {
    generateAllImages().catch(console.error);
}