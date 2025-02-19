declare global {
    interface Window {
        SalesforceInteractions?: {
            init(config: { cookieDomain: string }): Promise<void>
            initSitemap(sitemapconfig: any): Promise<void>
            setLoggingLevel(level: number): void
            sendEvent(event: { interaction: { name: string } }): Promise<void>
        };
    }
}

const useSalesforceInteractions = () => {

    /**
	 * Método privado para inicializar el SDK de Salesforce Interactions con la configuración proporcionada.
	 * @param initConfig Configuración de inicialización del SDK.
	 * @returns Una promesa que se resuelve una vez que el SDK se ha inicializado correctamente.
	 */
    const init = async (initConfig?: any): Promise<void> => {
        return window.SalesforceInteractions?.init(initConfig);
    };

    /**
	 * Método privado para inicializar el sitemap del sitio con la configuración proporcionada.
	 * @param sitemapConfig Configuración del sitemap del sitio.
	 */
    const initSitemap = async (sitemapConfig: any): Promise<void> => {
        return window.SalesforceInteractions?.initSitemap(sitemapConfig);
    };

    /**
	 * Método público para ejecutar el sitemap del sitio con la configuración especificada.
	 * @param initConfig Configuración de inicialización del SDK.
	 * @param sitemapConfig Configuración del sitemap del sitio.
	 * @param loggingLevel Nivel de registro para el SDK (0 a 5).
	 */
    const runSitemap = async (initConfig?: any, sitemapConfig?: any, loggingLevel: number = 0) => {
        if (!window.SalesforceInteractions || !sitemapConfig) return;

        window.SalesforceInteractions.setLoggingLevel(loggingLevel);

        try {
            await init(initConfig);
            await initSitemap(sitemapConfig);
            console.log("*** MCP Sdk ejecutó el sitemap :", sitemapConfig);
        } catch (error) {
            console.log("*** MCP Sdk error ejecutando el sitemap :", error);
        }
    };

	/**
	 * Método para enviar eventos asincrónicos al SDK de Salesforce Interactions.
	 * @param ev Evento a enviar.
	 */
    const sendEvent = async (ev: any) => {
        try {
            const res = await window.SalesforceInteractions?.sendEvent(ev);
            console.log("*** MCP Sdk evento enviado :", res);
        } catch (error) {
            console.error("*** MCP Sdk fallo enviando evento :", error);
        }
    };

    return { runSitemap, sendEvent };
};

export default useSalesforceInteractions;