# 1.	Einleitung

## 1.1 Kurzbeschreibung

Im Rahmen des Moduls Smart-Home Praktikum haben wir ein sensorbasiertes Multiplayer-Klavierspiel entwickelt. Das System ermöglicht es bis zu sechs Spielern, gemeinsam Musikstücke zu spielen, indem sie auf einem druckempfindlichen Boden (SensFloor) agieren. Eine grafische Oberfläche, die der Beamer auf den Boden projiziert, zeigt das Spielgeschehen. Die Spieler müssen im richtigen Takt auf die aufleuchtenden Felder treten, um die Noten einer ausgewählten Melodie zu spielen. Die Anwendung wurde als Desktop-Anwendung mit Web-Technologien entwickelt und bietet verschiedene Anpassungsmöglichkeiten für ein barrierearmes und unterhaltsames Spielerlebnis.

# 2.	Zielsetzung und Anforderungen

## 2.1 Anforderungen

Basierend auf dem Hauptziel wurden folgende funktionale und nicht-funktionale Anforderungen definiert:

**Technische Anforderungen:**

- Die Applikation muss auf einem Mini-PC oder einem Raspberry Pi ausführbar sein. 
- Der für die Projektion benötigte Beamer soll eine feste Montage ermöglichen.
 
**Spielanforderungen:**

- Ein zentrales Merkmal ist die Unterstützung eines kooperativen Multiplayer-Modus.

**Design- und UX-Anforderungen:**

- Zur Personalisierung sollen mehrere Farbschemata zur Auswahl stehen. 
- Für eine verbesserte Nutzererfahrung soll die Anwendung idealerweise beim Hochfahren des Systems automatisch starten.

# 3.	Systemarchitektur

## 3.1 Hardware-Komponenten

Das Gesamtsystem nutzt folgende, teilweise bereits vorhandene Hardware:
1.	**SensFloor:** Ein großflächiger, drucksensitiver Teppich, der die Position von Tritten erkennt und die entsprechenden Daten per WebSocket bereitstellt.
2.	**PC:** Der zentrale Rechner, auf dem die Spielanwendung läuft, die Logik verarbeitet und die Ausgabe steuert.
3.	**Beamer:** Projiziert die Benutzeroberfläche auf den SensFloor und gibt den Spielsound wieder.

## 3.2 Software-Architektur

Der Datenfluss im System ist wie folgt aufgebaut: 
Der SensFloor erfasst die Positionsdaten eines Tritts. Die auf dem PC laufende Hauptanwendung verbindet sich mit dem Server des SensFloors, empfängt die Positionsdaten und verarbeitet sie in der Spiellogik. Basierend auf der Eingabe wird eine unmittelbare audiovisuelle Rückmeldung generiert: Das visuelle Feedback wird per HDMI an den Beamer gesendet, während der entsprechende musikalische erzeugte Ton ausgegeben wird.

## 3.3 Verwendeter Technologiestack

- **Anwendungs-Framework:** Rust in Verbindung mit Tauri stellt hierbei das Backend dar. Es ermöglicht die Überführung des in JavaScript mit SvelteKit entwickelten Builds der Webanwendung in eine eigenständige Desktopanwendung.
- **Sound-Erzeugung:** Für das abspielen der MIDI-Dateien und das erzeugen der Klaviertöne wurde die JavaScript-Bibliothek Tone.js verwendet.
- **Kommunikation:** Die Bewegungs-Events auf dem SensFloor werden über das WebSocket-Protokoll an unsere Anwendung geschickt, welche zum Empfangen Socket-io verwendet.

# 4.	Ergebnis

## 4.1 Das Spielprinzip

Am unteren Rand des projizierten Bildes sind sechs Tasten dargestellt, auf welche die Spieler zum richtigen Zeitpunkt treten müssen. Dabei wird die Reihenfolge der Tasten sowie deren Timing durch Blöcke dargestellt, welche sich vom oberen Rand des projizierten Bildes nach unten hin bewegen. Trifft einer der Blöcke auf eine der Tasten, ist der “richtige Zeitpunkt” erreicht und die Spieler müssen auf die entsprechende Taste treten.
- **Bei erfolgreichem Timing:** Die Taste leuchtet auf, der korrekte Ton der Melodie wird gespielt und der Punktestand erhöht sich.
- **Bei fehlerhaftem Treten:** Wird eine Taste zum falschen Zeitpunkt gedrückt, wird ein Fehlerton abgespielt und die Taste leuchtet in der Fehlerfarbe auf.
Nachdem ein Song bis zum Ende durchgespielt wurde, erscheint ein Ergebnisbildschirm, auf welchem die Trefferquote sowie die Anzahl an Fehltritten angezeigt wird.

## 4.2 Steuerung und Menüführung

Die gesamte Bedienung des Spiels erfolgt über den SensFloor. Aufgrund der begrenzten Anzahl von maximal sechs gleichzeitig darstellbaren Buttons wurde eine tief verschachtelte Navigationsstruktur gewählt. 

Vom Hauptmenü aus können die Spieler zwischen den Optionen Spielen, Einstellungen und Beenden wählen. Der Einstellungen-Bereich verzweigt sich weiter in Untermenüs zur Anpassung von Geschwindigkeit (schneller, langsamer), Farbschema (Berry, Beach), Puffer (kleiner, größer) und Modus (normal, pause, playback). Parallel dazu existiert ein Admin-Panel, das per Tastendruck ("1") erreichbar ist und mit der Maus bedient wird. Es dient zur Songauswahl sowie der Ausrichtung des SensFloors und der Anwendung.

## 4.3 Spielmodi und Anpassungsmöglichkeiten

Um das Spiel für verschiedene Zielgruppen zugänglich zu machen, wurden diverse Individualisierungsoptionen implementiert:

### 4.3.1 Spielmodi

Es existieren drei verschiedene Spielmodi, welche für unterschiedliche Schwierigkeitsgrade und / oder Spielerlebnisse ausgelegt sind.

**Normal**
Dieser Spielmodus ist der Standardspielmodus. In diesem Spielmodus wird der ausgewählte Track der ausgewählten MIDI-Datei gespielt, wobei die Töne durch einen Tritt auf die Tasten am unteren Rand des vom Beamer dargestellten Bildes erzeugt werden.
Der Gedanke dieses Spielmodus ist es, dass die Spieler das Stück “selbst” spielen

**Pause**
Dieser Spielmodus funktioniert gleich wie der normale Modus, mit dem Unterschied, dass das Spiel jedes Mal, wenn eine Taste gedrückt werden muss, pausiert, bis die Taste erfolgreich gedrückt wird.
Da dieser Modus weder Timing noch Reaktionsschnelle erfordert, ist er als Anfängermodus gedacht.

**Playback**
Bei diesem Spielmodus wird die gesamte ausgewählte MIDI-Datei im Hintergrund abgespielt. Das Treten auf die Tasten erzeugt keine Töne, sondern beeinflusst lediglich den abschließenden Punktestand des Spiels.

### 4.3.2 Weitere Einstellungen

Neben der Auswahl des Spielmodus stehen weitere Einstellungen zur Individualisierung zur Verfügung:
- Die Geschwindigkeit des Spiels kann angepasst werden, um das gesamte Spiel schwerer oder einfacher zu machen
- Der Puffer (Fehlertoleranz) kann angepasst werden. Dadurch wird festgelegt, ob bzw. wie lange ein verfrühter Tastendruck schon als korrekt angesehen wird. Ein höherer Puffer senkt das vorausgesetzte Timing, was das Spielerlebnis vereinfacht.
	
## 4.4 Multiplayer-Modus

Das Spiel ist als kooperatives Erlebnis für zwei bis sechs Personen ausgelegt. Alle Spieler teilen sich die sechs Spielfelder und arbeiten gemeinsam daran, eine hohe prozentuale Trefferquote zu erzielen.

## 4.5 Design und UX

Ein besonderer Fokus lag auf der Gestaltung einer klaren und barrierefreien Benutzererfahrung.
- **Farbschemata und Kontrast:** Es wurden mehrere Farbschemata entwickelt, darunter monochrome Varianten (Berry) für Nutzer mit Farbenblindheit. Alle sind für Personen mit Farbsehschwäche geeignet
- **Farbverwendung:** Ein Drei-Farben-System (primary, secondary, error) wurde definiert, um die UI-Elemente hierarchisch zu gliedern.
- **Typografie:** Es wird ausschließlich die Web-Safe-Schriftart Verdana verwendet.
- **Button-Design:** Alle über den Teppich steuerbaren Buttons sind quadratisch und verfügen über eine weiße Umrandung, um sie klar vom schwarzen Hintergrund abzuheben.

# 5. Herausforderung

Während der Testphase wurden mehrere zentrale technische Herausforderungen identifiziert:
1.	**Latenz:** Gelegentlich tritt eine spürbare Verzögerung zwischen dem physischen Tritt auf den Teppich und der Reaktion in der Anwendung auf, was die Synchronität von Aktion und Musik beeinträchtigt. Da dem Team diese Verzögerung am Anfang nicht bewusst war, wurde bis zur Identifikation des Problems zur Mitte der Entwicklungszeit davon ausgegangen, dass es sich bei der Verzögerung um einen Fehler in unserer Anwendung handelt. Als Ursache für das Problem wird die aktuelle Systemarchitektur vermutet, bei der die WebSocket-Kommunikation über einen zwischengeschalteten Raspberry Pi läuft und auf einer veralteten Version der API basiert.
2.	**Beamer:** Die Anforderungen an den Beamer stellten eine größere Herausforderung dar als gedacht: der Beamer muss in der Lage sein, auf eine kurze Distanz eine relativ große Fläche zu beleuchten. Dabei muss das dargestellte Bild sowohl über eine gute Schärfe als auch eine gute Helligkeit verfügen und darf nicht bzw. nur kaum verzogen sein.
3.	**Kompatibilitätsprobleme mit Linux:** Auf Linux-Geräten wird das CSS teilweise nicht korrekt geladen. Auch hier war dem Team das Problem anfangs nicht bewusst und es wurde zu Beginn davon ausgegangen, dass es sich hierbei um eine Race Condition beim Start der Anwendung handelt.

# 6. Ausblick

## 6.1 Zusammenfassung

Das Projekt hat erfolgreich einen funktionierenden Prototyp eines sensorbasierten Multiplayer-Klavierspiels hervorgebracht. Das System kombiniert auf innovative Weise physische Interaktion mit einem musikalischen Rhythmusspiel und schafft ein motivierendes, kooperatives Erlebnis. Die technische Umsetzung mit modernen Web-Technologien erwies sich als flexibel und leistungsfähig.

## 6.2 Potenziale zur Weiterentwicklung

Basierend auf den Erkenntnissen aus der Entwicklungs- und Testphase ergeben sich klare nächste Schritte zur Verbesserung des Systems:

- **Optimierung der Systemarchitektur:** Die größte Priorität hat die Reduzierung der Latenz. Hierzu soll der WebSocket-Server direkt auf dem Haupt-PC implementiert werden, der auch die Anwendung ausführt. Durch den Wegfall des Raspberry Pi als Zwischenstation wird eine direktere und potenziell schnellere Kommunikation erwartet.
- **Internes Mapping der MIDI-Dateien:** Der aktuelle Algorithmus, um die Töne der eingelesenen MIDI-Datei auf die sechs vom Spiel verwendeten Tasten abzubilden, birgt Verbesserungspotenzial. Aufgrund der Abbildung auf lediglich 6 Tasten werden mehrere nah beieinander liegende Töne auf eine einzelne Taste abgebildet. Falls diese nah beieinander liegenden Töne in der MIDI-Datei häufig nacheinander gespielt werden, bildet der Algorithmus all diese Töne auf dieselbe Taste ab, wodurch der Spielspaß sinkt, da immer auf dieselbe Taste getreten werden muss. Hier könnte ein intelligenterer Algorithmus implementiert werden, welche solche (und noch potenziell weitere) Probleme erkennt und die Abbildung Töne auf die Tasten gegebenenfalls entsprechend anpasst.
- **Tastengröße:** Eine zukünftige Anpassung der Tastengröße und -art wurde als mögliche Erweiterung diskutiert.
- **Wiederholtes Treten entfernen:** Wie bereits im Dokument “Bekannte Probleme” erklärt, ist es aufgrund der Teppich-Signale nicht möglich, sehr schnell aufeinanderfolgende Tritte auf derselben Taste zu erkennen. Daher sollte auch vom Spieler in der Noten-Animation niemals verlangt werden, diese Tritt-Folge zu spielen, da sie faktisch nicht erkannt werden kann. Bei einigen Songs ist es daher zurzeit unmöglich, einen Score von 100% zu erreichen.
In Zukunft sollten diese schnell aufeinanderfolgenden Noten von unserer Anwendung entweder zusammengelegt oder rausgefiltert werden.
