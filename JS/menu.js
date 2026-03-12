<script>
        const btn = document.getElementById("mobile-menu-btn");
        const nav = document.querySelector("nav");

        btn.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
</script>
<script>
        window.addEventListener("scroll", () => {
        const nav = document.querySelector("nav");

        if (window.innerWidth > 768) { // SOLO desktop
            if (window.scrollY > 20) {
            nav.classList.add("nav-lateral");
            nav.style.opacity = "1";
            nav.style.pointerEvents = "auto";
            } else {
            nav.classList.remove("nav-lateral");
            }
        }
        });
</script>
<script>
        
            const slug = "la-mechada-real";
            const apiUrl = `https://back-end-restaurantes.onrender.com/api/menu/${slug}/`;

            const loading = document.getElementById("loading");
            const errorMessage = document.getElementById("error-message");
            const menuRoot = document.getElementById("menu");
            const carouselInner = document.getElementById("carousel-inner");
            const carouselIndicators = document.getElementById("carousel-indicators");

            const imagenesCategorias = {
                "Desayunos": "/Recursos/recurso1.webp",
                "Mechadas": "/Recursos/recurso2.webp",
                "Churrasco y Completos": "/Recursos/recurso3.webp",
                "Para Compartir": "/Recursos/recurso4.webp",
                "Platos": "/Recursos/recurso5.webp",
                "Menu Infantil": "/Recursos/recurso6.webp",
            };

            async function cargarMenuCompleto() {
                loading.style.display = "block";
                errorMessage.textContent = "";

                const avisoLento = setTimeout(() => {
                    loading.textContent = "⏳ El servidor está despertando, el menú puede tardar unos segundos...";
                }, 4000);

                try {
                    const response = await fetch(apiUrl);

                    if (!response.ok) {
                        throw new Error("No se pudo obtener el menú");
                    }

                    const data = await response.json();

                    clearTimeout(avisoLento);
                    loading.style.display = "none";

                    let slideIndex = 0;
                    let hayPromociones = false;
                    let contadorCategorias = 0;

                    data.forEach(categoria => {
                        const esPromocion = categoria.categoria.toLowerCase() === "promociones";

                        if (esPromocion && categoria.productos.length > 0) {
                            hayPromociones = true;

                            categoria.productos.forEach(producto => {
                                const indicator = document.createElement("button");
                                indicator.type = "button";
                                indicator.setAttribute("data-bs-target", "#carouselExampleDark");
                                indicator.setAttribute("data-bs-slide-to", slideIndex);

                                if (slideIndex === 0) {
                                    indicator.classList.add("active");
                                }

                                carouselIndicators.appendChild(indicator);

                                const slide = document.createElement("div");
                                slide.className = slideIndex === 0 ? "carousel-item active" : "carousel-item";

                                const promoContainer = document.createElement("div");
                                promoContainer.className = "promo-container";

                                const imgDiv = document.createElement("div");
                                imgDiv.className = "promo-img";

                                if (producto.imagen) {
                                    const img = document.createElement("img");
                                    img.src = producto.imagen.startsWith("http")
                                        ? producto.imagen
                                        : `https://back-end-restaurantes.onrender.com${producto.imagen}`;
                                    img.alt = producto.nombre;
                                    imgDiv.appendChild(img);
                                }

                                const badge = document.createElement("div");
                                badge.className = "promo-badge";
                                badge.textContent = "PROMOCIÓN";
                                imgDiv.appendChild(badge);

                                const detailDiv = document.createElement("div");
                                detailDiv.className = "promo-detail";
                                detailDiv.innerHTML = `
                                    <div class="promo-header">
                                        <h2>${producto.nombre}</h2>
                                        <div class="promo-price">$${producto.precio}</div>
                                    </div>

                                    <div class="promo-divider"></div>

                                    <p class="promo-description">${producto.descripcion || ""}</p>
                                    <p class="promo-condiciones">${producto.condiciones || ""}</p>
                                `;

                                promoContainer.appendChild(imgDiv);
                                promoContainer.appendChild(detailDiv);
                                slide.appendChild(promoContainer);
                                carouselInner.appendChild(slide);

                                slideIndex++;
                            });
                        } else if (!esPromocion && categoria.productos.length > 0) {
                            const section = document.createElement("section");
                            section.className = "categoria-section";

                            const container = document.createElement("div");
                            container.className = "categoria-flex";

                            if (contadorCategorias % 2 !== 0) {
                                container.style.flexDirection = "row-reverse";
                            }

                            const imagenDiv = document.createElement("div");
                            imagenDiv.className = "categoria-imagen";

                            const img = document.createElement("img");
                            img.src = imagenesCategorias[categoria.categoria] || "/Recursos/default.jpg";
                            img.alt = categoria.categoria;
                            imagenDiv.appendChild(img);

                            const listaDiv = document.createElement("div");
                            listaDiv.className = "categoria-lista";

                            const titulo = document.createElement("h2");
                            titulo.textContent = categoria.categoria;
                            listaDiv.appendChild(titulo);

                            categoria.productos.forEach(producto => {
                                const item = document.createElement("div");
                                item.className = "producto-item";

                                item.innerHTML = `
                                    <div>
                                        <strong>${producto.nombre}</strong>
                                        <p>${producto.descripcion || ""}</p>
                                    </div>
                                    <span>$${producto.precio}</span>
                                `;

                                listaDiv.appendChild(item);
                            });

                            container.appendChild(imagenDiv);
                            container.appendChild(listaDiv);
                            section.appendChild(container);
                            menuRoot.appendChild(section);

                            contadorCategorias++;
                        }
                    });

                    if (!hayPromociones) {
                        document.getElementById("carouselExampleDark").style.display = "none";
                    }

                } catch (error) {
                    clearTimeout(avisoLento);
                    loading.style.display = "none";
                    errorMessage.textContent = "El menú está tardando más de lo normal. Intenta nuevamente en unos segundos.";
                    console.error("Error cargando menú:", error);
                }
            }

            cargarMenuCompleto();
    </script>
