<h1>Dokumentácia</h1>

<h2>Pripojenie</h2>
<p>Na input nastav <strong>data-validation-group="<i>{{názov grupy inputs & buttons}}</i>"</strong>.</p>
<p>Ďalej je nutne pridať <strong>data-validation-group="<i>{{názov grupy}}</i>"</strong> aspoň pre jeden button.</p>
<p>Do body pridaj div z <strong>data-validation-for="<i>{{id validovaného inputu}}</i>"</strong> a v tvojom main.js súbore, vytvor inštanciu Validation.ts(stačí jedna na celú page) a zavolaj initialize().</p>

<h2>Ako to funguje</h2>
<p>Po spustení initialize() sa skontroluje ci na stránke existuje aspoň jeden element z atribútom data-validation-group.</p>
<p>Ak áno, tak sa skontroluje validita nastavení(každý input musi byt v grupe z aspon jednim buttnom) a ak je všetko v poriadku, tak pre každý input sa nastaví event change.</p>
<p>Pri odpálení eventu sa skontroluje validita inputu(cez prehliadač a klasické HTML atribúty) a podľa výsledku sa zobrazí v tele DIVu pre feedback odpovedajúca hláška(dodaná prehliadacom) + button grupy sa buď zablokuje alebo sprístupni pre akciu(disabled).</p>

<h2>Nezabudni</h2>
<ul>
<li>Nastaviť defaultne button na disabled</li>
<li>Pri zmene value pomocou JS vyvolať na inpute event input.dispatchEvent(new Event('input'))</li>
</ul>
