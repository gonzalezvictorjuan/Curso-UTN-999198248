# 📖 Clase 23: Introducción a Servidores y AWS

## 🎯 Objetivos de la Clase

- Comprender el concepto de Cloud Computing y sus beneficios frente a la infraestructura on-premise.
- Conocer Amazon Web Services (AWS) y su rol como proveedor líder de servicios en la nube.
- Identificar y diferenciar los servicios principales: EC2, S3, RDS y Lambda.
- Entender las mejores prácticas de seguridad (IAM) y gestión de costos en AWS.
- Implementar un script básico de conexión a AWS utilizando el SDK de Node.js.

---

## 📚 ¿Qué es Cloud Computing?

### 🔍 Definición

**Cloud Computing** (Computación en la Nube) es la entrega de servicios de computación —incluyendo servidores, almacenamiento, bases de datos, redes, software, análisis e inteligencia— a través de Internet ("la nube"), ofreciendo una innovación más rápida, recursos flexibles y economías de escala.

### 🏗️ Características Principales

- **Bajo Demanda:** Aprovisionamiento de recursos computacionales (CPU, almacenamiento) de forma automática y sin interacción humana directa.
- **Escalabilidad Elástica:** Capacidad de aumentar o disminuir recursos rápidamente según la demanda de tráfico o procesamiento.
- **Pago por Uso:** Modelo de facturación donde solo se paga por los recursos consumidos (segundos, gigabytes, solicitudes), convirtiendo gastos de capital (CapEx) en gastos operativos (OpEx).
- **Acceso Ubicuo:** Disponibilidad de los servicios desde cualquier lugar con conexión a Internet.

### 📖 Historia Breve

- **2006:** Lanzamiento oficial de AWS con servicios básicos como S3 y EC2, marcando el inicio de la nube pública moderna.
- **2008:** Google lanza App Engine y Microsoft anuncia Azure, iniciando la competencia de grandes proveedores.
- **2013:** La adopción de la nube crece exponencialmente; Netflix completa su migración masiva a AWS.
- **2014:** Lanzamiento de AWS Lambda, popularizando el concepto de "Serverless" (sin servidor).
- **Hoy:** La nube es el estándar para el despliegue de aplicaciones modernas, IA y Big Data.

---

## 🏛️ Servicios Core de AWS

### 📝 EC2 (Elastic Compute Cloud)

Es el servicio que proporciona capacidad de computación redimensionable en la nube. Básicamente, son **servidores virtuales**.

```javascript
// Ejemplo conceptual: No es código ejecutable, sino representación de una instancia
const instance = {
  type: "t2.micro", // Capa gratuita
  os: "Ubuntu 22.04 LTS",
  region: "us-east-1",
  securityGroup: ["allow-ssh", "allow-http"]
};
```

### 📝 S3 (Simple Storage Service)

Almacenamiento de objetos diseñado para ofrecer una durabilidad del 99.999999999%. Ideal para guardar imágenes, backups, logs y archivos estáticos.

```json
/* Estructura de un objeto en S3 */
{
  "Bucket": "mi-bucket-de-imagenes",
  "Key": "vaciones/foto1.jpg",
  "Body": <contenido_binario>,
  "Metadata": { "author": "usuario1" }
}
```

### 📝 RDS (Relational Database Service)

Servicio gestionado que facilita la configuración, operación y escalado de bases de datos relacionales como MySQL, PostgreSQL o MariaDB. AWS se encarga de los backups, parches y mantenimientos.

### 📝 AWS Lambda (Serverless)

Permite ejecutar código sin aprovisionar ni administrar servidores. Solo pagas por el tiempo de cómputo que consumes.

```javascript
// Ejemplo de una función Lambda handler en Node.js
export const handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('¡Hola desde AWS Lambda!'),
  };
  return response;
};
```

---

## 🏗️ Seguridad y Costos (Aspectos Críticos)

### 📄 IAM (Identity and Access Management)

Nunca uses tu cuenta raíz (root) para tareas diarias. IAM permite gestionar accesos de forma segura.

**Regla de Oro:** Principio de Mínimos Privilegios (dar solo el permiso necesario para la tarea).

```json
// Política IAM de ejemplo (Solo lectura a S3)
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "*"
        }
    ]
}
```

### 📄 Gestión de Costos

- **Costos Invisibles:** Instancias olvidadas encendidas o Lambdas en bucle infinito pueden generar facturas altas.
- **AWS Budgets:** Configura alertas para recibir emails cuando tu gasto supere un umbral (ej. $10 USD).

---

## 🚀 Ejercicio Práctico

### 📝 Listando Buckets de S3 con Node.js

Vamos a simular cómo interactuar con AWS desde nuestro código utilizando el SDK oficial.

**Requisitos previos:**
1.  Tener Node.js instalado.
2.  Tener credenciales de AWS configuradas (AWS Access Key ID y Secret Access Key).

**Archivo `list-buckets.js`:**

```javascript
import { S3Client, ListBucketsCommand } from "@aws-client/s3";

// 1. Configuración del Cliente
// Nota: Las credenciales suelen leerse automáticamente de variables de entorno o archivo ~/.aws/credentials
const client = new S3Client({ region: "us-east-1" });

const run = async () => {
  try {
    // 2. Crear el comando
    const command = new ListBucketsCommand({});

    // 3. Enviar el comando al servicio
    const data = await client.send(command);

    console.log("Éxito. Buckets encontrados:");
    data.Buckets.forEach((bucket) => {
      console.log(` - ${bucket.Name}`);
    });

  } catch (err) {
    console.error("Error", err);
  }
};

run();
```

**Para ejecutar:**
```bash
npm install @aws-client/s3
export AWS_ACCESS_KEY_ID=tu_key
export AWS_SECRET_ACCESS_KEY=tu_secret
node list-buckets.js
```

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio: Investigación de Arquitectura

Investiga y diseña (dibuja) una arquitectura simple para una aplicación web full-stack en AWS.

1.  **Frontend:** ¿Dónde alojarías el React App? (Pista: S3 + CloudFront o Amplify).
2.  **Backend:** ¿Dónde correría tu API Node.js? (Pista: EC2 o Lambda).
3.  **Base de Datos:** ¿Qué servicio usarías para MongoDB o SQL? (Pista: DocumentDB o RDS).
4.  **Investigar:** ¿Qué es el "Free Tier" (Capa Gratuita) de AWS y qué límites tiene?
5.  **Seguridad:** ¿Cómo protegerías las credenciales de tu base de datos? (Variables de entorno).
6.  **Cuenta:** Si es posible, crea una cuenta de AWS (requiere tarjeta) y configura **MFA** y una **Alerta de Presupuesto** de $1 USD.
7.  **Alternativas:** Busca 2 alternativas a AWS (ej. DigitalOcean, Vercel/Render) y compara precios para un servidor pequeño.

**Requisitos técnicos:**
- El diagrama puede ser hecho en papel, Excalidraw o draw.io.
- Entregar un breve resumen de los límites de la capa gratuita de EC2 y S3.

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [AWS Free Tier](https://aws.amazon.com/free/) - Detalle de lo que incluye la capa gratuita.
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/rds/index.html) - Documentación oficial del SDK.
- [Calculadora de Precios AWS](https://calculator.aws/#/) - Herramienta para estimar costos.
- [Introducción a IAM](https://aws.amazon.com/iam/) - Gestión de identidades.

### 📖 Conceptos para Investigar

- **Region vs Availability Zone (AZ):** Diferencia geográfica y de redundancia.
- **Vertical vs Horizontal Scaling:** Tipos de escalado.
- **Vendor Lock-in:** Riesgo de depender de un solo proveedor.
- **Infrastructure as Code (IaC):** Concepto (Terraform, CloudFormation).

---

## ❓ Preguntas Frecuentes

### ¿Necesito pagar para aprender AWS?

- **R:** No necesariamente. AWS ofrece una "Capa Gratuita" (Free Tier) por 12 meses para cuentas nuevas que incluye 750 horas de EC2 (t2.micro/t3.micro), 5GB de S3, etc. Sin embargo, **requiere tarjeta de crédito** para el registro y cobra si te excedes.

### ¿Qué pasa si dejo una instancia prendida?

- **R:** Si superas las horas gratuitas, AWS te cobrará por cada hora adicional. ¡Siempre para tus instancias cuando no las uses ("Stop Instance") y termina ("Terminate") lo que ya no sirva!

### ¿Es AWS la única opción?

- **R:** No. Existen Azure (Microsoft), Google Cloud (GCP) y opciones más sencillas para desarrolladores como DigitalOcean, Vercel, Render o Heroku. AWS es el más usado a nivel empresarial.

---

## 🎉 ¡Introducción a la Nube Dominada!

¡Excelente trabajo! Ya conoces los fundamentos de la nube y el ecosistema de AWS. En la próxima clase, integraremos todo lo aprendido del Backend y Frontend para construir una aplicación completa (PoC).

**Recuerda:** La nube es inmensa. No intentes aprenderte los +200 servicios de memoria. Domina los fundamentales (Compute, Storage, Database, Network) y el resto vendrá solo. ¡A volar! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre AWS o cómo configurar tu cuenta, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
